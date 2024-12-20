import { MAX_LIFE_POINT, MIN_LIFE_POINT } from "@/const/bossBattle";
import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { BossBattleModel } from "@/models/BossBattleModel";
import { MonsterModel } from "@/models/MonsterModel";
import { bbKParamState } from "@/stores/bbKParamState";
import { BossBattleState, bossBattleState } from "@/stores/bossBattleState";
import { BBState } from "@/types/BBState";
import { BossBattleLog } from "@/types/BossBattleLog";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import { EnumBossBattlePhase } from "@/types/EnumBossBattlePhase";
import { EnumItem } from "@/types/EnumItem";
import {
  generateMonsterAdjIfNotSet,
  generateSkillTypesIfNotSet,
  getBossSkill,
  getResultMsgIds,
  isBossSubAction,
  isBuffDebuffBoss,
  isBuffDebuffMonster,
  isDamageBoss,
  isDamageMonster,
  isHealMonster,
  startBossBattle,
} from "@/utils/bossBattleUtils";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

let gCurrentMonsterDamage = 0;
let gCurrentBossDamage = 0;
let gCurrentHealing = 0;
let gMonsterAdj = 0;
let gBossAdj = 0;

export interface BossBattleController {
  init: (monster: MonsterModel) => Promise<number[]>;
  moveStart: () => Promise<void>;
  moveFightSelector: () => void;
  moveItemSelector: () => void;
  useSkill: (
    resurrectionPrompt: string,
    skill: string,
    bossSkills: string[],
  ) => Promise<void>;
  defense: (resurrectionPrompt: string, bossSkills: string[]) => Promise<void>;
  useItem: (
    resurrectionPrompt: string,
    usedItemId: number,
    bossSkills: string[],
  ) => Promise<void>;
  setItemId: (itemId: number) => Promise<void>;
  nextResultMsg: () => Promise<void>;
  continueBossBattle: (resurrectionPrompt: string) => Promise<void>;
  end: (resurrectionPrompt: string) => Promise<void>;
  moveEnd: () => void;
  reset: () => void;
  pushLog: (log: BossBattleLog) => void;
  popLog: () => void;
}

export const useBossBattleValue = (): BossBattleState => {
  return useRecoilValue(bossBattleState);
};

export const useBossBattleController = (): BossBattleController => {
  // TODO: 後で消す
  const bbKParam = useRecoilValue(bbKParamState);

  const setBossBattle = useSetRecoilState(bossBattleState);

  /**
   * Init bossBattle
   */
  const init = async (monster: MonsterModel): Promise<number[]> => {
    const bossBattle = await ClientBossBattle.instance();
    const results = await Promise.all([
      bossBattle.getHighScores([monster.resurrectionPrompt]),
      bossBattle.getBBState(monster.resurrectionPrompt),
    ]);
    const highScore = results[0][0];
    let bbState = results[1];
    let skillTypes = monster.skillTypes;
    if (!bbState.bossBattleStarted) {
      const results = await Promise.all([
        generateSkillTypesIfNotSet(monster),
        generateMonsterAdjIfNotSet(monster.resurrectionPrompt),
      ]);
      skillTypes = results[0];
      bbState = await startBossBattle(monster.resurrectionPrompt, bbKParam);
    }

    _initGlobalParam();

    let newItemIds: number[] = [];
    if (bbState.hasBuffItem) newItemIds.push(EnumItem.buff);
    if (bbState.hasDebuffItem) newItemIds.push(EnumItem.debuff);
    if (bbState.hasHealItem) newItemIds.push(EnumItem.healing);
    if (bbState.hasEscapeItem) newItemIds.push(EnumItem.escape);

    setBossBattle(
      BossBattleModel.create({
        bossBattleStarted: bbState.bossBattleStarted,
        lp: bbState.lp,
        turn: bbState.turn,
        score: bbState.score,
        monsterAdj: bbState.monsterAdj,
        bossAdj: bbState.bossAdj,
        bossSign: bbState.bossSign,
        hasBuffItem: bbState.hasBuffItem,
        hasDebuffItem: bbState.hasDebuffItem,
        hasHealItem: bbState.hasHealItem,
        hasEscapeItem: bbState.hasEscapeItem,
        itemIds: newItemIds,
        phase: bbState.bossBattleContinued
          ? EnumBossBattlePhase.start
          : EnumBossBattlePhase.continue,
        highScore: highScore,
        defeated: bbState.lp <= MIN_LIFE_POINT,
      }),
    );
    return skillTypes;
  };

  /**
   * moveStart
   */
  const moveStart = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.start,
        setItemId: -1,
      });
    });
  };

  /**
   * moveFightSelector
   */
  const moveFightSelector = (): void => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: EnumBossBattlePhase.fightSelect });
    });
  };

  /**
   * moveItemSelector
   */
  const moveItemSelector = (): void => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: EnumBossBattlePhase.itemSelect });
    });
  };

  /**
   * useSkill
   * @param resurrectionPrompt resurrectionPrompt
   * @param skill skill
   */
  const useSkill = async (
    resurrectionPrompt: string,
    skill: string,
    bossSkills: string[],
  ): Promise<void> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/use-skill", {
        resurrectionPrompt,
        skill,
        bbKParam,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }
    const bossAction = res.data.bossAction;
    const otherSkillAction = res.data.otherSkillAction;
    const monsterHit = res.data.monsterHit;
    const bossHit = res.data.bossHit;
    const healing = res.data.healing;
    const monsterDamage = res.data.monsterDamage;
    const bossDamage = res.data.bossDamage;
    const bossSign = res.data.bossSign;
    const usedSkillType = res.data.usedSkillType;
    const droppedItemId = res.data.droppedItemId;
    const defensed = false;
    const newMonsterAdj = res.data.newMonsterAdj;
    const newBossAdj = res.data.newBossAdj;

    gCurrentMonsterDamage = monsterDamage;
    gCurrentBossDamage = bossDamage;
    gCurrentHealing = healing;
    gMonsterAdj = newMonsterAdj;
    gBossAdj = newBossAdj;

    let newResultMsgIds = getResultMsgIds(
      EnumItem.none,
      bossAction,
      usedSkillType,
      otherSkillAction,
      defensed,
    );
    if (droppedItemId !== EnumItem.none)
      newResultMsgIds = [EnumBossBattleMsg.droppedItem, ...newResultMsgIds];

    setBossBattle((prevState) => {
      let newResultMsgIds = getResultMsgIds(
        EnumItem.none,
        bossAction,
        usedSkillType,
        otherSkillAction,
        defensed,
      );

      let newItemIds = prevState.itemIds;
      if (droppedItemId !== EnumItem.none) {
        newItemIds = [...newItemIds, droppedItemId];
        newResultMsgIds = [EnumBossBattleMsg.droppedItem, ...newResultMsgIds];
      }

      if (isBossSubAction(bossSign, bossAction, EnumItem.none))
        newResultMsgIds = [...newResultMsgIds, EnumBossBattleMsg.bossSubAction];

      return prevState.copyWith({
        phase: EnumBossBattlePhase.result,
        usedMonsterSkill: skill,
        usedBossSkill: getBossSkill(bossSkills, bossSign, bossAction),
        currentMonsterDamage: monsterDamage,
        currentBossDamage: bossDamage,
        currentHealing: healing,
        currentMonsterHit: monsterHit,
        currentBossHit: bossHit,
        resultMsgIds: newResultMsgIds,
        droppedItemId: droppedItemId,
        itemIds: newItemIds,
      });
    });
  };

  /**
   * defense
   */
  const defense = async (
    resurrectionPrompt: string,
    bossSkills: string[],
  ): Promise<void> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/defense", {
        resurrectionPrompt,
        bbKParam,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }

    const bossAction = res.data.bossAction;
    const otherSkillAction = res.data.otherSkillAction;
    const monsterHit = res.data.monsterHit;
    const bossHit = res.data.bossHit;
    const healing = res.data.healing;
    const monsterDamage = res.data.monsterDamage;
    const bossDamage = res.data.bossDamage;
    const bossSign = res.data.bossSign;
    const usedSkillType = res.data.usedSkillType;
    const droppedItemId = res.data.droppedItemId;
    const defensed = true;
    const newMonsterAdj = res.data.newMonsterAdj;
    const newBossAdj = res.data.newBossAdj;

    gCurrentMonsterDamage = monsterDamage;
    gCurrentBossDamage = bossDamage;
    gCurrentHealing = healing;
    gMonsterAdj = newMonsterAdj;
    gBossAdj = newBossAdj;

    setBossBattle((prevState) => {
      let newResultMsgIds = getResultMsgIds(
        EnumItem.none,
        bossAction,
        usedSkillType,
        otherSkillAction,
        defensed,
      );

      let newItemIds = prevState.itemIds;
      if (droppedItemId !== EnumItem.none) {
        newItemIds = [...newItemIds, droppedItemId];
        newResultMsgIds = [EnumBossBattleMsg.droppedItem, ...newResultMsgIds];
      }

      if (isBossSubAction(bossSign, bossAction, EnumItem.none)) {
        newResultMsgIds = [...newResultMsgIds, EnumBossBattleMsg.bossSubAction];
      }

      return prevState.copyWith({
        phase: EnumBossBattlePhase.result,
        usedMonsterSkill: "",
        usedBossSkill: getBossSkill(bossSkills, bossSign, bossAction),
        currentMonsterDamage: monsterDamage,
        currentBossDamage: bossDamage,
        currentHealing: healing,
        currentMonsterHit: monsterHit,
        currentBossHit: bossHit,
        resultMsgIds: newResultMsgIds,
        droppedItemId: droppedItemId,
        defensed: defensed,
        itemIds: newItemIds,
      });
    });
  };

  /**
   * useItem
   * @param usedItemId itemId
   */
  const useItem = async (
    resurrectionPrompt: string,
    usedItemId: number,
    bossSkills: string[],
  ): Promise<void> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/use-item", {
        resurrectionPrompt,
        usedItemId,
        bbKParam,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }

    const bossAction = res.data.bossAction;
    const otherSkillAction = res.data.otherSkillAction;
    const monsterHit = res.data.monsterHit;
    const bossHit = res.data.bossHit;
    const healing = res.data.healing;
    const monsterDamage = res.data.monsterDamage;
    const bossDamage = res.data.bossDamage;
    const bossSign = res.data.bossSign;
    const usedSkillType = res.data.usedSkillType;
    const droppedItemId = res.data.droppedItemId;
    const defensed = false;
    const newMonsterAdj = res.data.newMonsterAdj;
    const newBossAdj = res.data.newBossAdj;

    gCurrentMonsterDamage = monsterDamage;
    gCurrentBossDamage = bossDamage;
    gCurrentHealing = healing;
    gMonsterAdj = newMonsterAdj;
    gBossAdj = newBossAdj;

    setBossBattle((prevState) => {
      let newResultMsgIds = getResultMsgIds(
        usedItemId,
        bossAction,
        usedSkillType,
        otherSkillAction,
        defensed,
      );
      let newItemIds = prevState.itemIds.filter(
        (itemId) => itemId !== usedItemId,
      );
      if (droppedItemId !== EnumItem.none) {
        newItemIds = [...newItemIds, droppedItemId];
        newResultMsgIds = [EnumBossBattleMsg.droppedItem, ...newResultMsgIds];
      }

      if (isBossSubAction(bossSign, bossAction, usedItemId)) {
        newResultMsgIds = [...newResultMsgIds, EnumBossBattleMsg.bossSubAction];
      }

      return prevState.copyWith({
        phase: EnumBossBattlePhase.result,
        usedMonsterSkill: "",
        usedBossSkill: getBossSkill(bossSkills, bossSign, bossAction),
        currentMonsterDamage: monsterDamage,
        currentBossDamage: bossDamage,
        currentHealing: healing,
        currentMonsterHit: monsterHit,
        currentBossHit: bossHit,
        resultMsgIds: newResultMsgIds,
        droppedItemId: droppedItemId,
        defensed: defensed,
        itemIds: newItemIds,
        usedItemId: usedItemId,
      });
    });
  };

  /**
   * set item
   * @param itemId itemId
   */
  const setItemId = async (itemId: number): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({
        setItemId: itemId,
      });
    });
  };

  /**
   * nextResultMsg
   */
  const nextResultMsg = async (): Promise<void> => {
    setBossBattle((prevState) => {
      const lastIndex = prevState.resultMsgIds.length - 1;
      const prevResultMsgId = prevState.resultMsgIds[lastIndex];

      let newResultMsgIds = prevState.resultMsgIds.filter(
        (_, index) => index !== lastIndex,
      );

      let newLp = prevState.lp;
      if (isHealMonster(prevResultMsgId)) newLp += gCurrentHealing;
      if (isDamageMonster(prevResultMsgId)) newLp -= gCurrentMonsterDamage;
      if (newLp <= MIN_LIFE_POINT) {
        newLp = MIN_LIFE_POINT;
        newResultMsgIds = [EnumBossBattleMsg.defeated];
      }
      if (newLp > MAX_LIFE_POINT) newLp = MAX_LIFE_POINT;

      let newMonsterAdj = prevState.monsterAdj;
      if (isBuffDebuffMonster(prevResultMsgId)) newMonsterAdj = gMonsterAdj;
      let newBossAdj = prevState.bossAdj;
      if (isBuffDebuffBoss(prevResultMsgId)) newBossAdj = gBossAdj;

      return prevState.copyWith({
        phase:
          newResultMsgIds.length === 0
            ? EnumBossBattlePhase.continue
            : prevState.phase,
        resultMsgIds: newResultMsgIds,
        score: isDamageBoss(prevResultMsgId)
          ? prevState.score + gCurrentBossDamage
          : prevState.score,
        lp: newLp,
        monsterAdj: newMonsterAdj,
        bossAdj: newBossAdj,
        defeated: newLp <= MIN_LIFE_POINT,
      });
      // TODO: 脱出アイテムの仕様次第でこっち使う
      // return prevState.copyWith({
      //   phase:
      //     newResultMsgIds.length === 0
      //       ? prevState.usedItemId === EnumItem.escape
      //         ? EnumBossBattlePhase.end
      //         : EnumBossBattlePhase.continue
      //       : prevState.phase,
      //   resultMsgIds: newResultMsgIds,
      //   score: isDamageBoss(prevResultMsgId)
      //     ? prevState.score + gCurrentBossDamage
      //     : prevState.score,
      //   lp: newLp,
      // });
    });
    return;
  };

  /**
   * continueBossBattle
   * @param resurrectionPrompt resurrectionPrompt
   */
  const continueBossBattle = async (
    resurrectionPrompt: string,
  ): Promise<void> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/continue", {
        resurrectionPrompt,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }
    const newBBState: BBState = res.data.newBBState;
    _initGlobalParam();

    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.start,
        turn: newBBState.turn,
        bossSign: newBBState.bossSign,
        usedMonsterSkill: "",
        currentBossDamage: gCurrentBossDamage,
        currentMonsterDamage: gCurrentMonsterDamage,
        currentHealing: gCurrentHealing,
        currentMonsterHit: false,
        currentBossHit: false,
        defensed: false,
        setItemId: EnumItem.none,
      });
    });
  };

  /**
   * end
   */
  const end = async (resurrectionPrompt: string): Promise<void> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/end", {
        resurrectionPrompt,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }
    _initGlobalParam();
    return;
  };

  /**
   * moveEnd
   */
  const moveEnd = (): void => {
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.end,
      });
    });
    return;
  };

  /**
   * reset
   */
  const reset = async (): Promise<void> => {
    _initGlobalParam();
    setBossBattle(BossBattleModel.create({}));
  };

  /**
   * pushLog
   */
  const pushLog = (log: BossBattleLog): void => {
    setBossBattle((prevState) => {
      return prevState.copyWith({
        logs: [...prevState.logs, log],
      });
    });
    return;
  };

  /**
   * popLog
   */
  const popLog = (): void => {
    setBossBattle((prevState) => {
      const lastIndex = prevState.logs.length - 1;
      const newHistories = prevState.logs.filter(
        (_, index) => index !== lastIndex,
      );
      return prevState.copyWith({
        logs: newHistories,
      });
    });
    return;
  };

  const controller: BossBattleController = {
    init,
    moveStart,
    moveFightSelector,
    moveItemSelector,
    useSkill,
    defense,
    useItem,
    setItemId,
    nextResultMsg,
    continueBossBattle,
    end,
    moveEnd,
    reset,
    pushLog,
    popLog,
  };
  return controller;
};

export const useBossBattleState = (): [
  BossBattleState,
  BossBattleController,
] => [useBossBattleValue(), useBossBattleController()];

const _initGlobalParam = (): void => {
  gCurrentMonsterDamage = 0;
  gCurrentBossDamage = 0;
  gCurrentHealing = 0;
  gMonsterAdj = 0;
  gBossAdj = 0;
};
