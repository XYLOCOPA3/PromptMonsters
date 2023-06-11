import { MAX_LIFE_POINT } from "@/const/bossBattle";
import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { BossBattleModel } from "@/models/BossBattleModel";
import { MonsterModel } from "@/models/MonsterModel";
import { BossBattleState, bossBattleState } from "@/stores/bossBattleState";
import { BBState } from "@/types/BBState";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import { EnumBossBattlePhase } from "@/types/EnumBossBattlePhase";
import { EnumItem } from "@/types/EnumItem";
import {
  generateMonsterAdjIfNotSet,
  generateSkillTypesIfNotSet,
  getBossSkill,
  getResultMsgIds,
  isDamageBoss,
  isDamageMonster,
  isHealMonster,
  startBossBattle,
} from "@/utils/bossBattleUtils";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

let gUsedBossSkill = "";
let gCurrentMonsterDamage = 0;
let gCurrentBossDamage = 0;
let gCurrentHealing = 0;
let gDroppedItemId = -1;
let gBossSign = 0;

export interface BossBattleController {
  init: (monster: MonsterModel) => Promise<number[]>;
  moveStart: () => Promise<void>;
  moveFightSelector: () => Promise<void>;
  moveItemSelector: () => Promise<void>;
  moveUserActionResult: () => Promise<void>;
  moveBossActionResult: () => Promise<void>;
  moveContinue: () => Promise<void>;
  moveEnd: (lifePoint: number) => Promise<void>;
  changePhase: (phase: EnumBossBattlePhase) => Promise<void>;
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
}

export const useBossBattleValue = (): BossBattleState => {
  return useRecoilValue(bossBattleState);
};

export const useBossBattleController = (): BossBattleController => {
  const setBossBattle = useSetRecoilState(bossBattleState);

  /**
   * Init bossBattle
   */
  const init = async (monster: MonsterModel): Promise<number[]> => {
    const results = await Promise.all([
      generateSkillTypesIfNotSet(monster),
      generateMonsterAdjIfNotSet(monster.resurrectionPrompt),
      ClientBossBattle.instance(),
    ]);
    const skillTypes = results[0];
    const bbState = await startBossBattle(monster.resurrectionPrompt);

    gUsedBossSkill = "";
    gCurrentMonsterDamage = 0;
    gCurrentBossDamage = 0;
    gCurrentHealing = 0;
    gDroppedItemId = -1;
    gBossSign = 0;

    setBossBattle(
      BossBattleModel.create({
        bossBattleStarted: bbState.bossBattleStarted,
        bossBattleContinued: bbState.bossBattleContinued,
        lp: bbState.lp,
        turn: bbState.turn,
        score: bbState.score,
        bossSign: bbState.bossSign,
        hasHealItem: bbState.hasHealItem,
        hasBuffItem: bbState.hasBuffItem,
        hasDebuffItem: bbState.hasDebuffItem,
        hasEscapeItem: bbState.hasEscapeItem,
        phase: bbState.bossBattleContinued
          ? EnumBossBattlePhase.start
          : EnumBossBattlePhase.continue,
      }),
    );
    return skillTypes;
  };

  /**
   * moveStart
   */
  const moveStart = async (): Promise<void> => {
    gUsedBossSkill = "";
    gCurrentMonsterDamage = 0;
    gDroppedItemId = -1;
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.start,
        defensed: false,
        setItemId: -1,
        usedItemId: -1,
        droppedItemId: -1,
        usedMonsterSkill: "",
        currentBossDamage: 0,
        currentMonsterDamage: 0,
        usedBossSkill: "",
      });
    });
  };

  /**
   * moveFightSelector
   */
  const moveFightSelector = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: EnumBossBattlePhase.fightSelect });
    });
  };

  /**
   * moveItemSelector
   */
  const moveItemSelector = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: EnumBossBattlePhase.itemSelect });
    });
  };

  /**
   * moveUserActionResult
   */
  const moveUserActionResult = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: EnumBossBattlePhase.fightResult });
    });
  };

  /**
   * moveBossActionResult
   */
  const moveBossActionResult = async (): Promise<void> => {
    setBossBattle((prevState) => {
      if (prevState.itemIds.includes(gDroppedItemId)) gDroppedItemId = -1;
      return prevState.copyWith({
        phase: EnumBossBattlePhase.bossActionResult,
        usedBossSkill: gUsedBossSkill,
        currentMonsterDamage: gCurrentMonsterDamage,
        lp:
          prevState.lp - gCurrentMonsterDamage < 0
            ? 0
            : prevState.lp - gCurrentMonsterDamage,
        itemIds:
          gDroppedItemId === -1
            ? prevState.itemIds
            : [...prevState.itemIds, gDroppedItemId],
        droppedItemId: gDroppedItemId,
      });
    });
  };

  /**
   * moveContinue
   */
  const moveContinue = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.continue,
        bossSign: gBossSign,
      });
    });
  };

  /**
   * moveEnd
   */
  const moveEnd = async (lifePoint: number): Promise<void> => {
    if (lifePoint > 0) {
      // TODO: スコア更新リクエスト
    }
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.end,
        defeated: lifePoint > 0 ? false : true,
      });
    });
    return;
  };

  /**
   * changePhase
   * @param phase phase
   */
  const changePhase = async (phase: EnumBossBattlePhase): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase });
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
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response!.status === 500) return e.response!.data.battleResult;
        throw new Error(e.response!.data.message);
      }
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

    gCurrentMonsterDamage = monsterDamage;
    gCurrentBossDamage = bossDamage;
    gCurrentHealing = healing;

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
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response!.status === 500) return e.response!.data.battleResult;
        throw new Error(e.response!.data.message);
      }
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

    gUsedBossSkill = usedSkillType;
    gCurrentMonsterDamage = monsterDamage;
    gCurrentBossDamage = bossDamage;
    gCurrentHealing = healing;

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
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response!.status === 500) return e.response!.data.battleResult;
        throw new Error(e.response!.data.message);
      }
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

    gUsedBossSkill = usedSkillType;
    gCurrentMonsterDamage = monsterDamage;
    gCurrentBossDamage = bossDamage;
    gCurrentHealing = healing;

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
      const newResultMsgIds = prevState.resultMsgIds.filter(
        (_, index) => index !== lastIndex,
      );
      let newLp = prevState.lp;
      if (isHealMonster(prevResultMsgId)) newLp += gCurrentHealing;
      if (isDamageMonster(prevResultMsgId)) newLp -= gCurrentMonsterDamage;
      if (newLp < 0) newLp = 0;
      if (newLp > MAX_LIFE_POINT) newLp = MAX_LIFE_POINT;
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
      if (axios.isAxiosError(e)) {
        if (e.response!.status === 500) return e.response!.data.battleResult;
        throw new Error(e.response!.data.message);
      }
      console.error(e);
      throw new Error("Unknown Error");
    }
    const newBBState: BBState = res.data.newBBState;
    _initGlobalParam();

    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: EnumBossBattlePhase.start,
        bossBattleContinued: newBBState.bossBattleContinued,
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

  const controller: BossBattleController = {
    init,
    moveStart,
    moveFightSelector,
    moveItemSelector,
    moveUserActionResult,
    moveBossActionResult,
    moveContinue,
    moveEnd,
    changePhase,
    useSkill,
    defense,
    useItem,
    setItemId,
    nextResultMsg,
    continueBossBattle,
  };
  return controller;
};

export const useBossBattleState = (): [
  BossBattleState,
  BossBattleController,
] => [useBossBattleValue(), useBossBattleController()];

const _getBossActionResult = async (): Promise<any> => {
  // TODO: ボスの行動をリクエスト
  const usedBossSkill = "ギャラクティック・メテオストーム";
  const monsterDamage = 100;
  const droppedItemId = 0;
  const bossNextActionSignIndex = 0;

  return {
    usedBossSkill,
    monsterDamage,
    droppedItemId,
    bossNextActionSignIndex,
  };
};

const _initGlobalParam = (): void => {
  gUsedBossSkill = "";
  gCurrentMonsterDamage = 0;
  gCurrentBossDamage = 0;
  gCurrentHealing = 0;
  gDroppedItemId = -1;
  gBossSign = 0;
};
