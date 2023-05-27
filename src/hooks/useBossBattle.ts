import { BossBattleModel } from "@/models/BossBattleModel";
import { BossBattleState, bossBattleState } from "@/stores/bossBattleState";
import { BossBattlePhase } from "@/types/BossBattlePhase";
import { EnumItem } from "@/types/EnumItem";
import { useRecoilValue, useSetRecoilState } from "recoil";

let usedBossSkill = "";
let bossDamaged = 0;
let droppedItemId = -1;
let bossNextActionSignIndex = -1;

export interface BossBattleController {
  init: () => void;
  moveStart: () => Promise<void>;
  moveFightSelector: () => Promise<void>;
  moveItemSelector: () => Promise<void>;
  moveUserActionResult: () => Promise<void>;
  moveBossActionResult: () => Promise<void>;
  moveContinue: () => Promise<void>;
  moveEnd: (lifePoint: number) => Promise<void>;
  changePhase: (phase: BossBattlePhase) => Promise<void>;
  attack: (skill: string) => Promise<void>;
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
  const init = (): void => {
    usedBossSkill = "";
    bossDamaged = 0;
    droppedItemId = -1;
    bossNextActionSignIndex = -1;
    setBossBattle(BossBattleModel.create({}));
  };

  /**
   * moveStart
   */
  const moveStart = async (): Promise<void> => {
    usedBossSkill = "";
    bossDamaged = 0;
    droppedItemId = -1;
    bossNextActionSignIndex = -1;
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
        lifePoint:
          prevState.lifePoint - bossDamaged < 0
            ? 0
            : prevState.lifePoint - bossDamaged,
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
        bossNextActionSignIndex,
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
   * @param skill skill
   */
  const attack = async (skill: string): Promise<void> => {
    // TODO: ダメージ計算リクエスト
    const monsterDamaged = 50;

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
            lifePoint: result.lifePoint,
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
