import { BOSS_WEAKNESS_FEATURES, MAX_LIFE_POINT } from "@/const/bossBattle";
import { DevBBKState } from "@/dev/stores/devBBkParamState";
import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { MonsterModel } from "@/models/MonsterModel";
import { IPromptMonstersExtension } from "@/typechain/PromptMonsters";
import { BBState } from "@/types/BBState";
import { EnumBossAction } from "@/types/EnumBossAction";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import { EnumItem } from "@/types/EnumItem";
import { EnumOtherSkillAction } from "@/types/EnumOtherSkillAction";
import { EnumSkillType } from "@/types/EnumSkillType";
import { EventKey } from "@/types/EventKey";
import { MonsterAdj } from "@/types/MonsterAdj";
import { hasUnknownSkill } from "@/utils/monsterUtils";
import axios from "axios";

export const generateSkillTypesIfNotSet = async (
  monster: MonsterModel,
): Promise<number[]> => {
  if (!hasUnknownSkill(monster.skillTypes)) {
    console.log("Your monster has no unknown skill.");
    return monster.skillTypes;
  }
  let res: any;
  try {
    res = await axios.post("/api/boss/generate-skill-desc", {
      resurrectionPrompt: monster.resurrectionPrompt,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response!.status === 500) return e.response!.data.battleResult;
      throw new Error(e.response!.data.message);
    }
    console.error(e);
    throw new Error("Unknown Error");
  }
  return res.data.skillTypes;
};

export const generateMonsterAdjIfNotSet = async (
  resurrectionPrompt: string,
): Promise<MonsterAdj> => {
  const bossBattle = await ClientBossBattle.instance();
  const monsterAdj = await bossBattle.getMonsterAdj(resurrectionPrompt);
  if (monsterAdj.weaknessFeatureAdj > 0) return monsterAdj;
  let res: any;
  try {
    res = await axios.post("/api/boss/generate-adj", {
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
  const newMonsterAdj = res.data.monsterAdj;
  return newMonsterAdj;
};

export const hasBossWeaknessFeatures = (
  monster: IPromptMonstersExtension.MonsterExtensionStructOutput,
  eventKey: EventKey,
): boolean => {
  const weaknessFeatures = BOSS_WEAKNESS_FEATURES[eventKey];
  const pattern = new RegExp(weaknessFeatures);
  if (pattern.test(monster.feature)) return true;
  if (pattern.test(monster.name)) return true;
  if (pattern.test(monster.flavor)) return true;
  return false;
};

export const startBossBattle = async (
  resurrectionPrompt: string,
  devBBkParam: DevBBKState, // TODO: dev用
): Promise<BBState> => {
  const bossBattle = await ClientBossBattle.instance();
  const bbState = await bossBattle.getBBState(resurrectionPrompt);
  if (bbState.bossBattleStarted) return bbState;
  let res: any;
  try {
    res = await axios.post("/api/boss/start", {
      resurrectionPrompt,
      devBBkParam,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response!.status === 500) return e.response!.data.battleResult;
      throw new Error(e.response!.data.message);
    }
    console.error(e);
    throw new Error("Unknown Error");
  }
  return res.data.newBBState;
};

// TODO: Enumにしてどの値が不正かを判断できるようにする
export const isInvalidMonsterAdj = (monsterAdj: MonsterAdj): boolean => {
  if (monsterAdj.weaknessFeatureAdj <= 0) return true;
  return false;
};

export const initMonsterAdj = (monsterAdj: MonsterAdj): number => {
  return monsterAdj.weaknessFeatureAdj;
};

export const getBossSign = (): number => {
  /*
  選択率
  - 一撃必殺: 10%
  - 強攻撃: 30%
  - 弱攻撃: 20%
  - カウンター: 10%
  - バフ: 10%
  - デバフ: 10%
  - 防御: 10%
  */

  // 0-99の乱数を生成
  const random = Math.floor(Math.random() * 100);
  let bossSign: number;
  // 一撃必殺
  if (random < 10) {
    bossSign = random;
  }
  // 強攻撃
  else if (10 <= random && random < 40) {
    // 10-19の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 10;
  }
  // 弱攻撃
  else if (40 <= random && random < 60) {
    // 20-29の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 20;
  }
  // カウンター
  else if (60 <= random && random < 70) {
    // 30-39の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 30;
  }
  // バフ
  else if (70 <= random && random < 80) {
    // 40-49の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 40;
  }
  // デバフ
  else if (80 <= random && random < 90) {
    // 50-59の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 50;
  }
  // 防御
  else {
    // 60-69の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 60;
  }
  return bossSign;
};

export const decideAction = (bossSign: number): EnumBossAction => {
  const random = Math.floor(Math.random() * 100);
  let bossAction: number = EnumBossAction.none;
  // 一撃必殺
  if (bossSign < 10) {
    bossAction = EnumBossAction.oneHitKill;
  }
  // 強攻撃
  else if (10 <= bossSign && bossSign < 20) {
    if (random < 95) {
      bossAction = EnumBossAction.powerAttack;
    } else if (95 <= random && random < 98) {
      bossAction = EnumBossAction.attack;
    } else {
      bossAction = EnumBossAction.debuff;
    }
  }
  // 弱攻撃
  else if (20 <= bossSign && bossSign < 30) {
    if (random < 95) {
      bossAction = EnumBossAction.attack;
    } else if (95 <= random && random < 98) {
      bossAction = EnumBossAction.powerAttack;
    } else {
      bossAction = EnumBossAction.powerAttack;
    }
  }
  // カウンター
  else if (30 <= bossSign && bossSign < 40) {
    if (random < 95) {
      bossAction = EnumBossAction.counterAttack;
    } else if (95 <= random && random < 98) {
      bossAction = EnumBossAction.attack;
    } else {
      bossAction = EnumBossAction.debuff;
    }
  }
  // バフ
  else if (40 <= bossSign && bossSign < 50) {
    if (random < 95) {
      bossAction = EnumBossAction.buff;
    } else if (95 <= random && random < 98) {
      bossAction = EnumBossAction.defense;
    } else {
      bossAction = EnumBossAction.counterAttack;
    }
  }
  // デバフ
  else if (50 <= bossSign && bossSign < 60) {
    if (random < 95) {
      bossAction = EnumBossAction.debuff;
    } else if (95 <= random && random < 98) {
      bossAction = EnumBossAction.defense;
    } else {
      bossAction = EnumBossAction.counterAttack;
    }
  }
  // 防御
  else {
    if (random < 95) {
      bossAction = EnumBossAction.defense;
    } else if (95 <= random && random < 98) {
      bossAction = EnumBossAction.attack;
    } else {
      bossAction = EnumBossAction.powerAttack;
    }
  }
  return bossAction;
};

export const judgeSkillHit = (skillType: number): boolean => {
  if (
    skillType === EnumSkillType.physicalAttack ||
    skillType === EnumSkillType.specialAttack
  ) {
    const random = Math.floor(Math.random() * 100);
    if (random >= 90) return false;
  }
  return true;
};

export const hasItem = (usedItemId: number, bbState: BBState): boolean => {
  if (usedItemId === EnumItem.buff && bbState.hasBuffItem) return true;
  if (usedItemId === EnumItem.debuff && bbState.hasDebuffItem) return true;
  if (usedItemId === EnumItem.healing && bbState.hasHealItem) return true;
  if (usedItemId === EnumItem.escape && bbState.hasEscapeItem) return true;
  return false;
};

export const judgeBossSkillHit = (
  bossAction: EnumBossAction,
  skillType: number,
  otherSkillAction: EnumOtherSkillAction,
  monsterHit: boolean,
  defensed: boolean,
  itemUsed: boolean,
): boolean => {
  const random = Math.floor(Math.random() * 100);
  if (bossAction === EnumBossAction.oneHitKill) return random < 3;
  if (bossAction === EnumBossAction.powerAttack) return random < 85;
  if (bossAction === EnumBossAction.attack) return random < 95;
  if (bossAction === EnumBossAction.counterAttack) {
    if (defensed || itemUsed) return false;
    if (skillType === EnumSkillType.healing) return false;
    if (otherSkillAction === EnumOtherSkillAction.absoluteDefense) return false;
    if (otherSkillAction === EnumOtherSkillAction.fullHealing) return false;
    return monsterHit;
  }
  if (
    bossAction === EnumBossAction.buff ||
    bossAction === EnumBossAction.debuff
  ) {
    if (defensed || itemUsed) return true;
    if (skillType === EnumSkillType.healing) return true;
    if (otherSkillAction === EnumOtherSkillAction.absoluteDefense) return true;
    if (otherSkillAction === EnumOtherSkillAction.fullHealing) return true;
    return !monsterHit;
  }
  return true;
};

export const decideOtherSkillType = (
  atk: number,
  int: number,
): EnumOtherSkillAction => {
  const random = Math.floor(Math.random() * 100);
  // 攻撃
  if (random < 40) {
    if (atk >= int) return EnumOtherSkillAction.physicalAttack;
    return EnumOtherSkillAction.specialAttack;
  }
  // 強攻撃
  if (40 <= random && random < 50) {
    if (atk >= int) return EnumOtherSkillAction.powerPhysicalAttack;
    return EnumOtherSkillAction.powerSpecialAttack;
  }
  // 絶対防御
  if (50 <= random && random < 80) return EnumOtherSkillAction.absoluteDefense;
  // 全回復
  return EnumOtherSkillAction.fullHealing;
};

export const calcBossDamage = (
  monsterHit: boolean,
  usedSkillType: number,
  otherSkillAction: EnumOtherSkillAction,
  bossAction: EnumBossAction,
  monsterAtk: number,
  monsterInt: number,
  bossDef: number,
  bossMgr: number,
  monsterAdj: number,
  bossAdj: number,
  turn: number,
  devBBkParam: DevBBKState,
): number => {
  if (!monsterHit) return 0;
  if (
    usedSkillType === EnumSkillType.none &&
    otherSkillAction === EnumOtherSkillAction.none
  )
    return 0;
  if (usedSkillType === EnumSkillType.healing) return 0;
  if (otherSkillAction === EnumOtherSkillAction.absoluteDefense) return 0;
  if (otherSkillAction === EnumOtherSkillAction.fullHealing) return 0;

  // TODO: kは要調整!!!
  const kMonsterAtk = devBBkParam.kMonsterAtk;
  const kMonsterInt = devBBkParam.kMonsterInt;
  const kBossDef = devBBkParam.kBossDef;
  const kBossMgr = devBBkParam.kBossMgr;
  const kMonsterPower = devBBkParam.kMonsterPower;
  const kCommonTurn = turn === 1 ? 1 : devBBkParam.kCommonTurn * turn;

  const adjMonsterAtk = (monsterAtk * monsterAdj) / 100;
  const adjMonsterInt = (monsterInt * monsterAdj) / 100;
  const adjBossDef = (bossDef * bossAdj) / 100;
  const adjBossMgr = (bossMgr * bossAdj) / 100;

  let bossDamage: number = 0;
  if (
    usedSkillType === EnumSkillType.physicalAttack ||
    otherSkillAction === EnumOtherSkillAction.physicalAttack
  ) {
    bossDamage =
      kCommonTurn * kMonsterAtk * adjMonsterAtk - kBossDef * adjBossDef;
  } else if (
    usedSkillType === EnumSkillType.specialAttack ||
    otherSkillAction === EnumOtherSkillAction.specialAttack
  ) {
    bossDamage =
      kCommonTurn * kMonsterInt * adjMonsterInt - kBossMgr * adjBossMgr;
  } else if (otherSkillAction === EnumOtherSkillAction.powerPhysicalAttack) {
    bossDamage =
      kCommonTurn * kMonsterPower * kMonsterAtk * adjMonsterAtk -
      kBossDef * adjBossDef;
  } else if (otherSkillAction === EnumOtherSkillAction.powerSpecialAttack) {
    bossDamage =
      kCommonTurn * kMonsterPower * kMonsterInt * adjMonsterInt -
      kBossMgr * adjBossMgr;
  }
  if (bossAction === EnumBossAction.defense) bossDamage *= 0.1;

  return Math.floor(bossDamage) > 0 ? Math.floor(bossDamage) : 1;
};

export const calcMonsterDamage = (
  bossHit: boolean,
  usedBossSkillType: number,
  otherSkillAction: EnumOtherSkillAction,
  bossAction: EnumBossAction,
  bossAtk: number,
  bossInt: number,
  monsterDef: number,
  monsterMgr: number,
  monsterAdj: number,
  bossAdj: number,
  turn: number,
  defensed: boolean,
  devBBkParam: DevBBKState,
): number => {
  if (!bossHit) return 0;
  if (bossAction === EnumBossAction.none) return 0;
  if (bossAction === EnumBossAction.buff) return 0;
  if (bossAction === EnumBossAction.debuff) return 0;
  if (bossAction === EnumBossAction.defense) return 0;
  if (otherSkillAction === EnumOtherSkillAction.absoluteDefense) return 0;
  if (bossAction === EnumBossAction.oneHitKill) return MAX_LIFE_POINT;

  let isPhysicalAttack = false;
  if (usedBossSkillType === EnumSkillType.physicalAttack)
    isPhysicalAttack = true;
  if (
    usedBossSkillType === EnumSkillType.healing ||
    usedBossSkillType === EnumSkillType.other
  ) {
    // 0-1の乱数を生成
    const random = Math.floor(Math.random() * 2);
    if (random === 1) isPhysicalAttack = true;
  }

  // TODO: kは要調整!!!
  const kBossAtk = devBBkParam.kBossAtk;
  const kBossInt = devBBkParam.kBossInt;
  const kMonsterDef = devBBkParam.kMonsterDef;
  const kMonsterMgr = devBBkParam.kMonsterMgr;
  const kBossPower = devBBkParam.kBossPower;
  const kCommonTurn = turn === 1 ? 1 : devBBkParam.kCommonTurn * turn;

  const adjBossAtk = (bossAtk * bossAdj) / 100;
  const adjBossInt = (bossInt * bossAdj) / 100;
  const adjMonsterDef = (monsterDef * monsterAdj) / 100;
  const adjMonsterMgr = (monsterMgr * monsterAdj) / 100;

  let monsterDamage: number = 0;
  if (bossAction === EnumBossAction.powerAttack) {
    if (isPhysicalAttack) {
      monsterDamage =
        kCommonTurn * kBossPower * kBossAtk * adjBossAtk -
        kMonsterDef * adjMonsterDef;
    } else {
      monsterDamage =
        kCommonTurn * kBossPower * kBossInt * adjBossInt -
        kMonsterMgr * adjMonsterMgr;
    }
  } else if (bossAction === EnumBossAction.attack) {
    if (isPhysicalAttack) {
      monsterDamage =
        kCommonTurn * kBossAtk * adjBossAtk - kMonsterDef * adjMonsterDef;
    } else {
      monsterDamage =
        kCommonTurn * kBossInt * adjBossInt - kMonsterMgr * adjMonsterMgr;
    }
  } else if (bossAction === EnumBossAction.counterAttack) {
    if (isPhysicalAttack) {
      monsterDamage =
        kCommonTurn * kBossPower * kBossAtk * adjBossAtk -
        kMonsterDef * adjMonsterDef;
    } else {
      monsterDamage =
        kCommonTurn * kBossPower * kBossInt * adjBossInt -
        kMonsterMgr * adjMonsterMgr;
    }
  }
  if (defensed) monsterDamage *= 0.1;

  console.log("monsterDamage: ", Math.floor(monsterDamage));
  return Math.floor(monsterDamage) > 0 ? Math.floor(monsterDamage) : 1;
};

export const calcHealing = (
  usedSkillType: number,
  otherSkillAction: EnumOtherSkillAction,
  usedItemId: number,
  monsterInt: number,
  monsterAdj: number,
  devBBkParam: DevBBKState,
): number => {
  if (otherSkillAction === EnumOtherSkillAction.fullHealing)
    return MAX_LIFE_POINT;
  if (usedItemId === EnumItem.healing) return MAX_LIFE_POINT;
  if (usedSkillType !== EnumSkillType.healing) return 0;

  // TODO: kは要調整!!!
  const kMonsterHealing = devBBkParam.kMonsterHealing;

  const adjMonsterInt = (monsterInt * monsterAdj) / 100;

  return Math.floor(kMonsterHealing * adjMonsterInt);
};

export const calcLifePoint = (
  currentLp: number,
  monsterDamage: number,
  healing: number,
): number => {
  let lp =
    currentLp + healing > MAX_LIFE_POINT ? MAX_LIFE_POINT : currentLp + healing;
  lp = lp - monsterDamage < 0 ? 0 : lp - monsterDamage;
  return lp;
};

export const buffMonster = (
  monsterAdj: number,
  devBBkParam: DevBBKState,
): number => {
  // TODO: kは要調整!!!
  const kMonsterBuff = devBBkParam.kMonsterBuff;

  return Math.floor(kMonsterBuff * monsterAdj);
};

export const debuffMonster = (
  monsterAdj: number,
  devBBkParam: DevBBKState,
): number => {
  // TODO: kは要調整!!!
  const kMonsterDebuff = devBBkParam.kMonsterDebuff;

  return Math.floor(kMonsterDebuff * monsterAdj);
};

export const buffBoss = (bossAdj: number, devBBkParam: DevBBKState): number => {
  // TODO: kは要調整!!!
  const kBossBuff = devBBkParam.kBossBuff;

  return Math.floor(kBossBuff * bossAdj);
};

export const debuffBoss = (
  bossAdj: number,
  devBBkParam: DevBBKState,
): number => {
  // TODO: kは要調整!!!
  const kBossDebuff = devBBkParam.kBossDebuff;

  return Math.floor(kBossDebuff * bossAdj);
};

export const getBossSkill = (
  bossSkills: string[],
  bossSign: number,
  bossAction: EnumBossAction,
): string => {
  if (bossAction === EnumBossAction.none) return "";
  const usedBossSkillIndex = (bossSign % 10) + (bossAction - 1) * 10;
  return bossSkills[usedBossSkillIndex];
};

export const getResultMsgIds = (
  usedItemId: number,
  bossAction: number,
  usedSkillType: number,
  usedOtherSkillAction: number,
  defensed: boolean,
): EnumBossBattleMsg[] => {
  if (usedItemId === EnumItem.escape)
    return [EnumBossBattleMsg.monsterItemEscape];
  if (bossAction === EnumBossAction.counterAttack) {
    if (usedSkillType === EnumSkillType.physicalAttack)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightPhysicalAttack,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedSkillType === EnumSkillType.specialAttack)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightSpecialAttack,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedSkillType === EnumSkillType.healing)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightHeal,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.physicalAttack)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.specialAttack)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.powerPhysicalAttack)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.powerSpecialAttack)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.absoluteDefense)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightOtherDefense,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.fullHealing)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterFightOtherHeal,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (defensed)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterDefense,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedItemId === EnumItem.buff)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterItemBuff,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedItemId === EnumItem.debuff)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterItemDebuff,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
    if (usedItemId === EnumItem.healing)
      return [
        EnumBossBattleMsg.bossCounterAttack,
        EnumBossBattleMsg.monsterItemHeal,
        EnumBossBattleMsg.bossPreCounterAttack,
      ];
  }
  if (usedOtherSkillAction === EnumOtherSkillAction.absoluteDefense) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightOtherDefense,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightOtherDefense,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightOtherDefense,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightOtherDefense,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightOtherDefense,
      ];
    if (bossAction === EnumBossAction.defense)
      return [
        EnumBossBattleMsg.bossDefense,
        EnumBossBattleMsg.monsterFightOtherDefense,
      ];
  }
  if (defensed) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterDefense,
      ];
    if (bossAction === EnumBossAction.attack)
      return [EnumBossBattleMsg.bossAttack, EnumBossBattleMsg.monsterDefense];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterDefense,
      ];
    if (bossAction === EnumBossAction.buff)
      return [EnumBossBattleMsg.bossBuff, EnumBossBattleMsg.monsterDefense];
    if (bossAction === EnumBossAction.debuff)
      return [EnumBossBattleMsg.bossDebuff, EnumBossBattleMsg.monsterDefense];
    if (bossAction === EnumBossAction.defense)
      return [EnumBossBattleMsg.bossDefense, EnumBossBattleMsg.monsterDefense];
  }
  if (bossAction === EnumBossAction.defense) {
    if (usedSkillType === EnumSkillType.physicalAttack)
      return [
        EnumBossBattleMsg.monsterFightPhysicalAttack,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedSkillType === EnumSkillType.specialAttack)
      return [
        EnumBossBattleMsg.monsterFightSpecialAttack,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedSkillType === EnumSkillType.healing)
      return [
        EnumBossBattleMsg.monsterFightHeal,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.physicalAttack)
      return [
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.specialAttack)
      return [
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.powerPhysicalAttack)
      return [
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.powerSpecialAttack)
      return [
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedOtherSkillAction === EnumOtherSkillAction.fullHealing)
      return [
        EnumBossBattleMsg.monsterFightOtherHeal,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedItemId === EnumItem.buff)
      return [EnumBossBattleMsg.monsterItemBuff, EnumBossBattleMsg.bossDefense];
    if (usedItemId === EnumItem.debuff)
      return [
        EnumBossBattleMsg.monsterItemDebuff,
        EnumBossBattleMsg.bossDefense,
      ];
    if (usedItemId === EnumItem.healing)
      return [EnumBossBattleMsg.monsterItemHeal, EnumBossBattleMsg.bossDefense];
  }
  if (usedSkillType === EnumSkillType.physicalAttack) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightPhysicalAttack,
      ];
  }
  if (usedSkillType === EnumSkillType.specialAttack) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightSpecialAttack,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightSpecialAttack,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightSpecialAttack,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightSpecialAttack,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightSpecialAttack,
      ];
  }
  if (usedSkillType === EnumSkillType.healing) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightHeal,
      ];
    if (bossAction === EnumBossAction.attack)
      return [EnumBossBattleMsg.bossAttack, EnumBossBattleMsg.monsterFightHeal];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightHeal,
      ];
    if (bossAction === EnumBossAction.buff)
      return [EnumBossBattleMsg.bossBuff, EnumBossBattleMsg.monsterFightHeal];
    if (bossAction === EnumBossAction.debuff)
      return [EnumBossBattleMsg.bossDebuff, EnumBossBattleMsg.monsterFightHeal];
  }
  if (usedOtherSkillAction === EnumOtherSkillAction.physicalAttack) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightOtherPhysicalAttack,
      ];
  }
  if (usedOtherSkillAction === EnumOtherSkillAction.specialAttack) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightOtherSpecialAttack,
      ];
  }
  if (usedOtherSkillAction === EnumOtherSkillAction.powerPhysicalAttack) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack,
      ];
  }
  if (usedOtherSkillAction === EnumOtherSkillAction.powerSpecialAttack) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack,
      ];
  }
  if (usedOtherSkillAction === EnumOtherSkillAction.fullHealing) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterFightOtherHeal,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterFightOtherHeal,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterFightOtherHeal,
      ];
    if (bossAction === EnumBossAction.buff)
      return [
        EnumBossBattleMsg.bossBuff,
        EnumBossBattleMsg.monsterFightOtherHeal,
      ];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterFightOtherHeal,
      ];
  }
  if (usedItemId === EnumItem.buff) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterItemBuff,
      ];
    if (bossAction === EnumBossAction.attack)
      return [EnumBossBattleMsg.bossAttack, EnumBossBattleMsg.monsterItemBuff];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterItemBuff,
      ];
    if (bossAction === EnumBossAction.buff)
      return [EnumBossBattleMsg.bossBuff, EnumBossBattleMsg.monsterItemBuff];
    if (bossAction === EnumBossAction.debuff)
      return [EnumBossBattleMsg.bossDebuff, EnumBossBattleMsg.monsterItemBuff];
  }
  if (usedItemId === EnumItem.debuff) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterItemDebuff,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterItemDebuff,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterItemDebuff,
      ];
    if (bossAction === EnumBossAction.buff)
      return [EnumBossBattleMsg.bossBuff, EnumBossBattleMsg.monsterItemDebuff];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterItemDebuff,
      ];
  }
  if (usedItemId === EnumItem.healing) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterItemHeal,
      ];
    if (bossAction === EnumBossAction.attack)
      return [EnumBossBattleMsg.bossAttack, EnumBossBattleMsg.monsterItemHeal];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterItemHeal,
      ];
    if (bossAction === EnumBossAction.buff)
      return [EnumBossBattleMsg.bossBuff, EnumBossBattleMsg.monsterItemHeal];
    if (bossAction === EnumBossAction.debuff)
      return [EnumBossBattleMsg.bossDebuff, EnumBossBattleMsg.monsterItemHeal];
  }
  if (usedItemId === EnumItem.escape) {
    if (bossAction === EnumBossAction.oneHitKill)
      return [
        EnumBossBattleMsg.bossOneHitKill,
        EnumBossBattleMsg.monsterItemEscape,
      ];
    if (bossAction === EnumBossAction.attack)
      return [
        EnumBossBattleMsg.bossAttack,
        EnumBossBattleMsg.monsterItemEscape,
      ];
    if (bossAction === EnumBossAction.powerAttack)
      return [
        EnumBossBattleMsg.bossPowerAttack,
        EnumBossBattleMsg.monsterItemEscape,
      ];
    if (bossAction === EnumBossAction.buff)
      return [EnumBossBattleMsg.bossBuff, EnumBossBattleMsg.monsterItemEscape];
    if (bossAction === EnumBossAction.debuff)
      return [
        EnumBossBattleMsg.bossDebuff,
        EnumBossBattleMsg.monsterItemEscape,
      ];
  }
  return [];
};

export const isDamageMonster = (prevResultMsgId: number): boolean => {
  if (prevResultMsgId === EnumBossBattleMsg.bossOneHitKill) return true;
  if (prevResultMsgId === EnumBossBattleMsg.bossAttack) return true;
  if (prevResultMsgId === EnumBossBattleMsg.bossPowerAttack) return true;
  if (prevResultMsgId === EnumBossBattleMsg.bossCounterAttack) return true;
  return false;
};

export const decideDroppedItem = (
  hasBuffItem: boolean,
  hasDebuffItem: boolean,
  hasHealItem: boolean,
  hasEscapeItem: boolean,
): EnumItem => {
  const random = Math.floor(Math.random() * 100);
  if (random < 9 && !hasBuffItem) return EnumItem.buff;
  if (9 <= random && random < 18 && !hasDebuffItem) return EnumItem.debuff;
  if (18 <= random && random < 27 && !hasHealItem) return EnumItem.healing;
  if (27 <= random && random < 30 && !hasEscapeItem) return EnumItem.escape;
  return EnumItem.none;
};

export const isDamageBoss = (prevResultMsgId: number): boolean => {
  const p = prevResultMsgId;
  if (p === EnumBossBattleMsg.monsterFightPhysicalAttack) return true;
  if (p === EnumBossBattleMsg.monsterFightSpecialAttack) return true;
  if (p === EnumBossBattleMsg.monsterFightOtherPhysicalAttack) return true;
  if (p === EnumBossBattleMsg.monsterFightOtherSpecialAttack) return true;
  if (p === EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack) return true;
  if (p === EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack) return true;
  return false;
};

export const isHealMonster = (prevResultMsgId: number): boolean => {
  const p = prevResultMsgId;
  if (p === EnumBossBattleMsg.monsterFightHeal) return true;
  if (p === EnumBossBattleMsg.monsterFightOtherHeal) return true;
  if (p === EnumBossBattleMsg.monsterItemHeal) return true;
  return false;
};

export const getInitialBBState = (
  monsterAdj: number,
  bossSign: number,
): BBState => {
  const newBBState: BBState = {
    bossBattleStarted: true,
    bossBattleContinued: true,
    lp: MAX_LIFE_POINT,
    turn: 1,
    score: 0,
    monsterAdj: monsterAdj,
    bossAdj: 100,
    bossSign: bossSign,
    hasHealItem: false,
    hasBuffItem: false,
    hasDebuffItem: false,
    hasEscapeItem: false,
  };
  return newBBState;
};

/*

# 優先度
優先度 -> 行動

- モンスター
1 -> たたかう: 物理攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.physicalAttack
1 -> たたかう: 特殊攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.specialAttack
1 -> たたかう: 回復 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.healing
1 -> たたかう: 物理攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillAction.physicalAttack
1 -> たたかう: 特殊攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillAction.specialAttack
1 -> たたかう: 強物理攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillAction.powerPhysicalAttack
1 -> たたかう: 強特殊攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillAction.powerSpecialAttack
3 -> たたかう: 絶対防御 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillAction.absoluteDefense
1 -> たたかう: 全回復 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillAction.fullHealing
3 -> ぼうぎょ: 防御 -> defense api
1 -> どうぐ: バフ -> used-item api -> usedItemId
1 -> どうぐ: デバフ -> used-item api -> usedItemId
1 -> どうぐ: 全回復 -> used-item api -> usedItemId
5 -> どうぐ: 脱出 -> used-item api -> usedItemId

- ボス
0 -> 一撃必殺 -> EnumBossAction.oneHitKill
0 -> 攻撃 -> EnumBossAction.attack
0 -> 強攻撃 -> EnumBossAction.powerAttack
4 -> カウンター攻撃(構え) -> EnumBossAction.counterAttack
0 -> カウンター攻撃(攻撃) -> EnumBossAction.counterAttack
0 -> バフ -> EnumBossAction.buff
0 -> デバフ -> EnumBossAction.debuff
2 -> 防御 -> EnumBossAction.defense


# シーン種類
- モンスター
-> 5

- モンスター -> ボス
-> 3 -> 2
-> 3 -> 0
-> 1 -> 0

- ボス -> モンスター
-> 2 -> 1

- ボス -> モンスター -> ボス
-> 4(構え) -> 3 -> 4(攻撃)
-> 4(構え) -> 1 -> 4(攻撃)

# 文言
- モンスター
0 -> たたかう: 物理攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.physicalAttack
0 -> たたかう: 特殊攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.specialAttack
1 -> たたかう: 回復 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.healing
2 -> たたかう: 物理攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillType.physicalAttack
3 -> たたかう: 特殊攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillType.specialAttack
4 -> たたかう: 強物理攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillType.powerPhysicalAttack
5 -> たたかう: 強特殊攻撃 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillType.powerSpecialAttack
6 -> たたかう: 絶対防御 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillType.absoluteDefense
7 -> たたかう: 全回復 -> used-skill api -> skill -> usedSkillType -> EnumSkillType.other -> EnumOtherSkillType.fullHealing
8 -> ぼうぎょ: 防御 -> defense api
9 -> どうぐ: バフ -> used-item api -> itemName
9 -> どうぐ: デバフ -> used-item api -> itemName
9 -> どうぐ: 全回復 -> used-item api -> itemName
9 -> どうぐ: 脱出 -> used-item api -> itemName

- ボス
10 -> 一撃必殺 -> EnumBossAction.oneHitKill
11 -> 攻撃 -> EnumBossAction.attack
11 -> 強攻撃 -> EnumBossAction.powerAttack
12 -> カウンター攻撃(構え) -> EnumBossAction.counterAttack
13 -> カウンター攻撃(攻撃) -> EnumBossAction.counterAttack
14 -> バフ -> EnumBossAction.buff
15 -> デバフ -> EnumBossAction.debuff
16 -> 防御 -> EnumBossAction.defense


*/
