import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { BossBattleModel } from "@/models/BossBattleModel";
import { MonsterModel } from "@/models/MonsterModel";
import { BossBattleState, bossBattleState } from "@/stores/bossBattleState";
import { BossBattlePhase } from "@/types/BossBattlePhase";
import { EnumItem } from "@/types/EnumItem";
import {
  generateMonsterAdjIfNotSet,
  generateSkillTypesIfNotSet,
  startBossBattle,
} from "@/utils/bossBattleUtils";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

let usedBossSkill = "";
let bossDamaged = 0;
let droppedItemId = -1;
let bossNextActionSignIndex = 0;

export interface BossBattleController {
  init: (monster: MonsterModel) => Promise<number[]>;
  moveStart: () => Promise<void>;
  moveFightSelector: () => Promise<void>;
  moveItemSelector: () => Promise<void>;
  moveUserActionResult: () => Promise<void>;
  moveBossActionResult: () => Promise<void>;
  moveContinue: () => Promise<void>;
  moveEnd: (lifePoint: number) => Promise<void>;
  changePhase: (phase: BossBattlePhase) => Promise<void>;
  attack: (resurrectionPrompt: string, skill: string) => Promise<void>;
  defense: () => Promise<void>;
  setItemId: (itemId: number) => Promise<void>;
  useItem: (itemId: number) => Promise<void>;
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

    usedBossSkill = "";
    bossDamaged = 0;
    droppedItemId = -1;
    bossNextActionSignIndex = 0;

    console.log(bbState);

    setBossBattle(
      BossBattleModel.create({
        bossBattleStarted: bbState.bossBattleStarted,
        bossBattleContinued: bbState.bossBattleContinued,
        lp: bbState.lp,
        turn: bbState.turn,
        score: bbState.score,
        monsterAdj: bbState.monsterAdj,
        bossAdj: bbState.bossAdj,
        bossSign: bbState.bossSign,
        hasHealItem: bbState.hasHealItem,
        hasBuffItem: bbState.hasBuffItem,
        hasDebuffItem: bbState.hasDebuffItem,
        hasEscapeItem: bbState.hasEscapeItem,
        phase: bbState.bossBattleContinued
          ? BossBattlePhase.start
          : BossBattlePhase.continue,
      }),
    );
    return skillTypes;
  };

  /**
   * moveStart
   */
  const moveStart = async (): Promise<void> => {
    // TODO: 戻るでターンが進まないようにする
    usedBossSkill = "";
    bossDamaged = 0;
    droppedItemId = -1;
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: BossBattlePhase.start,
        turn: prevState.turn + 1,
        defensed: false,
        setItemId: -1,
        usedItemId: -1,
        droppedItemId: -1,
        usedMonsterSkill: "",
        currentMonsterDamaged: 0,
        currentBossDamaged: 0,
        usedBossSkill: "",
      });
    });
  };

  /**
   * moveFightSelector
   */
  const moveFightSelector = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: BossBattlePhase.fightSelect });
    });
  };

  /**
   * moveItemSelector
   */
  const moveItemSelector = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: BossBattlePhase.itemSelect });
    });
  };

  /**
   * moveUserActionResult
   */
  const moveUserActionResult = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase: BossBattlePhase.fightResult });
    });
  };

  /**
   * moveBossActionResult
   */
  const moveBossActionResult = async (): Promise<void> => {
    setBossBattle((prevState) => {
      if (prevState.itemIds.includes(droppedItemId)) droppedItemId = -1;
      return prevState.copyWith({
        phase: BossBattlePhase.bossActionResult,
        usedBossSkill,
        currentBossDamaged: bossDamaged,
        lp: prevState.lp - bossDamaged < 0 ? 0 : prevState.lp - bossDamaged,
        itemIds:
          droppedItemId === -1
            ? prevState.itemIds
            : [...prevState.itemIds, droppedItemId],
        droppedItemId: droppedItemId,
      });
    });
  };

  /**
   * moveContinue
   */
  const moveContinue = async (): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: BossBattlePhase.continue,
        bossSign: bossNextActionSignIndex,
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
        phase: BossBattlePhase.end,
        defeated: lifePoint > 0 ? false : true,
      });
    });
    return;
  };

  /**
   * changePhase
   * @param phase phase
   */
  const changePhase = async (phase: BossBattlePhase): Promise<void> => {
    setBossBattle((prevState) => {
      return prevState.copyWith({ phase });
    });
  };

  /**
   * attack
   * @param resurrectionPrompt resurrectionPrompt
   * @param skill skill
   */
  const attack = async (
    resurrectionPrompt: string,
    skill: string,
  ): Promise<void> => {
    // TODO: ダメージ計算リクエスト
    let res: any;
    try {
      res = await axios.post("/api/boss/attack", {
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
    console.log(res);
    const monsterDamaged = res.data.monsterDamaged;
    console.log(monsterDamaged);

    // const monsterDamaged = 50;

    const results = await _getBossActionResult();
    usedBossSkill = results.usedBossSkill;
    bossDamaged = results.bossDamaged;
    droppedItemId = results.droppedItemId;
    bossNextActionSignIndex = results.bossNextActionSignIndex;

    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: BossBattlePhase.fightResult,
        score: prevState.score + monsterDamaged,
        usedMonsterSkill: skill,
        currentMonsterDamaged: monsterDamaged,
      });
    });
  };

  /**
   * defense
   */
  const defense = async (): Promise<void> => {
    // TODO: ぼうぎょリクエスト

    const results = await _getBossActionResult();
    usedBossSkill = results.usedBossSkill;
    bossDamaged = results.bossDamaged;
    droppedItemId = results.droppedItemId;
    bossNextActionSignIndex = results.bossNextActionSignIndex;

    setBossBattle((prevState) => {
      return prevState.copyWith({
        phase: BossBattlePhase.defenseResult,
        defensed: true,
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
   * useItem
   * @param itemId itemId
   */
  const useItem = async (itemId: number): Promise<void> => {
    // TODO: アイテム使用リクエスト
    const result = { lifePoint: 400 };

    const results = await _getBossActionResult();
    usedBossSkill = results.usedBossSkill;
    bossDamaged = results.bossDamaged;
    droppedItemId = results.droppedItemId;
    bossNextActionSignIndex = results.bossNextActionSignIndex;

    switch (itemId) {
      case EnumItem.potion:
        setBossBattle((prevState) => {
          return prevState.copyWith({
            phase: BossBattlePhase.itemResult,
            lp: result.lifePoint,
            setItemId: -1,
            itemIds: prevState.itemIds.filter((id) => id !== itemId),
            usedItemId: itemId,
          });
        });
        break;
      case EnumItem.elixir:
        // TODO: アイテム効果反映
        break;
      case EnumItem.scroll:
        // TODO: アイテム効果反映
        break;
      default:
        break;
    }
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
    attack,
    defense,
    setItemId,
    useItem,
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
  const bossDamaged = 100;
  const droppedItemId = 0;
  const bossNextActionSignIndex = 0;

  return { usedBossSkill, bossDamaged, droppedItemId, bossNextActionSignIndex };
};