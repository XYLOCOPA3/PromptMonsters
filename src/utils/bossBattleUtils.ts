import {
  BOSS_ATK_HIT_RATE,
  BOSS_ATK_SEL_RATE,
  BOSS_BUFF_SEL_RATE,
  BOSS_CATK_SEL_RATE,
  BOSS_DEBUFF_SEL_RATE,
  BOSS_DEF_SEL_RATE,
  BOSS_ITEM_BUFF_DROPPED_RATE,
  BOSS_ITEM_DEBUFF_DROPPED_RATE,
  BOSS_ITEM_ESCAPE_DROPPED_RATE,
  BOSS_ITEM_HEALING_DROPPED_RATE,
  BOSS_MAIN_SEL_RATE,
  BOSS_OHK_HIT_RATE,
  BOSS_OHK_SEL_RATE,
  BOSS_PATK_HIT_RATE,
  BOSS_PATK_SEL_RATE,
  BOSS_WEAKNESS_FEATURES,
  FIRST_TURN,
  MAX_BOSS_ADJ,
  MAX_LIFE_POINT,
  MAX_MONSTER_ADJ,
  MAX_MONSTER_DAMAGE,
  MAX_TURN_ADJ,
  MIN_BOSS_ADJ,
  MIN_MONSTER_ADJ,
  MONSTER_OTHER_ADEF_SEL_RATE,
  MONSTER_OTHER_ATK_SEL_RATE,
  MONSTER_OTHER_FHEAL_SEL_RATE,
  MONSTER_OTHER_PATK_SEL_RATE,
} from "@/const/bossBattle";
import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { MonsterModel } from "@/models/MonsterModel";
import { BBKState } from "@/stores/bbKParamState";
import { BBState } from "@/types/BBState";
import { EnumBossAction } from "@/types/EnumBossAction";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import { EnumBossBattleQuote } from "@/types/EnumBossBattleQuote";
import { EnumBossSign } from "@/types/EnumBossSign";
import { EnumItem } from "@/types/EnumItem";
import { EnumOtherSkillAction } from "@/types/EnumOtherSkillAction";
import { EnumSkillType } from "@/types/EnumSkillType";
import { EventKey } from "@/types/EventKey";
import { MonsterAdj } from "@/types/MonsterAdj";
import { Status } from "@/types/Status";
import { StatusContract } from "@/types/StatusContract";
import { hasUnknownSkill } from "@/utils/monsterUtils";
import axios from "axios";

export const generateSkillTypesIfNotSet = async (
  monster: MonsterModel,
): Promise<number[]> => {
  if (!hasUnknownSkill(monster.skillTypes)) return monster.skillTypes;
  let res: any;
  try {
    res = await axios.post("/api/boss/generate-skill-desc", {
      resurrectionPrompt: monster.resurrectionPrompt,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
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
    if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
    console.error(e);
    throw new Error("Unknown Error");
  }
  return res.data.monsterAdj;
};

export const hasBossWeaknessFeatures = (
  eventKey: EventKey,
  feature: string,
  name: string,
  flavor: string,
): RegExpMatchArray | null => {
  const weaknessFeatures = BOSS_WEAKNESS_FEATURES[eventKey];
  const pattern = new RegExp(`(${weaknessFeatures})`, "gi");
  let matches = feature.match(pattern);
  if (matches !== null) return matches;
  matches = name.match(pattern);
  if (matches !== null) return matches;
  matches = flavor.match(pattern);
  if (matches !== null) return matches;
  return matches;
};

export const startBossBattle = async (
  resurrectionPrompt: string,
  bbKParam: BBKState, // TODO: 後で消す
): Promise<BBState> => {
  let res: any;
  try {
    res = await axios.post("/api/boss/start", {
      resurrectionPrompt,
      bbKParam,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
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
  const random = Math.floor(Math.random() * 100);
  let selRate = BOSS_OHK_SEL_RATE;

  // 一撃必殺
  if (random < selRate) return random;
  selRate += BOSS_PATK_SEL_RATE;

  // 強攻撃
  if (random < selRate)
    return Math.floor(Math.random() * 10) + EnumBossSign.signOneHitKill;
  selRate += BOSS_ATK_SEL_RATE;

  // 攻撃
  if (random < selRate)
    return Math.floor(Math.random() * 10) + EnumBossSign.signPowerAttack;
  selRate += BOSS_CATK_SEL_RATE;

  // カウンター
  if (random < selRate)
    return Math.floor(Math.random() * 10) + EnumBossSign.signAttack;
  selRate += BOSS_BUFF_SEL_RATE;

  // バフ
  if (random < selRate)
    return Math.floor(Math.random() * 10) + EnumBossSign.signCounterAttack;
  selRate += BOSS_DEBUFF_SEL_RATE;

  // デバフ
  if (random < selRate)
    return Math.floor(Math.random() * 10) + EnumBossSign.signBuff;
  selRate += BOSS_DEF_SEL_RATE;

  // 防御
  if (random < selRate)
    return Math.floor(Math.random() * 10) + EnumBossSign.signDebuff;

  return Math.floor(Math.random() * 10) + EnumBossSign.none;
};

export const decideBossAction = (bossSign: number): EnumBossAction => {
  const random = Math.floor(Math.random() * 100);

  // 一撃必殺
  if (bossSign < EnumBossSign.signOneHitKill)
    return random < BOSS_MAIN_SEL_RATE
      ? EnumBossAction.oneHitKill
      : EnumBossAction.powerAttack;
  // 強攻撃
  if (bossSign < EnumBossSign.signPowerAttack)
    return random < BOSS_MAIN_SEL_RATE
      ? EnumBossAction.powerAttack
      : EnumBossAction.buff;
  // 攻撃
  if (bossSign < EnumBossSign.signAttack)
    return random < BOSS_MAIN_SEL_RATE
      ? EnumBossAction.attack
      : EnumBossAction.powerAttack;
  // カウンター
  if (bossSign < EnumBossSign.signCounterAttack)
    return random < BOSS_MAIN_SEL_RATE
      ? EnumBossAction.counterAttack
      : EnumBossAction.debuff;
  // バフ
  if (bossSign < EnumBossSign.signBuff)
    return random < BOSS_MAIN_SEL_RATE
      ? EnumBossAction.buff
      : EnumBossAction.counterAttack;
  // デバフ
  if (bossSign < EnumBossSign.signDebuff)
    return random < BOSS_MAIN_SEL_RATE
      ? EnumBossAction.debuff
      : EnumBossAction.counterAttack;
  // 防御
  return random < BOSS_MAIN_SEL_RATE
    ? EnumBossAction.defense
    : EnumBossAction.powerAttack;
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
  if (bossAction === EnumBossAction.oneHitKill)
    return random < BOSS_OHK_HIT_RATE;
  if (bossAction === EnumBossAction.powerAttack)
    return random < BOSS_PATK_HIT_RATE;
  if (bossAction === EnumBossAction.attack) return random < BOSS_ATK_HIT_RATE;
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
  let selRate = MONSTER_OTHER_ATK_SEL_RATE;

  // 攻撃
  if (random < selRate) {
    if (atk >= int) return EnumOtherSkillAction.physicalAttack;
    return EnumOtherSkillAction.specialAttack;
  }

  selRate += MONSTER_OTHER_PATK_SEL_RATE;
  // 強攻撃
  if (random < selRate) {
    if (atk >= int) return EnumOtherSkillAction.powerPhysicalAttack;
    return EnumOtherSkillAction.powerSpecialAttack;
  }

  selRate += MONSTER_OTHER_ADEF_SEL_RATE;
  // 絶対防御
  if (random < selRate) return EnumOtherSkillAction.absoluteDefense;

  selRate += MONSTER_OTHER_FHEAL_SEL_RATE;
  // 全回復
  if (random < selRate) return EnumOtherSkillAction.fullHealing;

  return EnumOtherSkillAction.none;
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
  bbKParam: BBKState,
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
  const kMonsterAtk = Number(bbKParam.kMonsterAtk);
  const kMonsterInt = Number(bbKParam.kMonsterInt);
  const kBossDef = Number(bbKParam.kBossDef);
  const kBossMgr = Number(bbKParam.kBossMgr);
  const kMonsterPower = Number(bbKParam.kMonsterPower);
  let kTurn = Number(bbKParam.kTurn) * (turn - 1);
  if (turn === FIRST_TURN) kTurn = 1;
  if (kTurn > MAX_TURN_ADJ) kTurn = MAX_TURN_ADJ;

  const adjMonsterAtk = (monsterAtk * monsterAdj) / 100;
  const adjMonsterInt = (monsterInt * monsterAdj) / 100;
  const adjBossDef = (bossDef * bossAdj) / 100;
  const adjBossMgr = (bossMgr * bossAdj) / 100;

  let bossDamage: number = 0;
  if (
    usedSkillType === EnumSkillType.physicalAttack ||
    otherSkillAction === EnumOtherSkillAction.physicalAttack
  ) {
    bossDamage = kTurn * kMonsterAtk * adjMonsterAtk - kBossDef * adjBossDef;
  } else if (
    usedSkillType === EnumSkillType.specialAttack ||
    otherSkillAction === EnumOtherSkillAction.specialAttack
  ) {
    bossDamage = kTurn * kMonsterInt * adjMonsterInt - kBossMgr * adjBossMgr;
  } else if (otherSkillAction === EnumOtherSkillAction.powerPhysicalAttack) {
    bossDamage =
      kTurn * kMonsterPower * kMonsterAtk * adjMonsterAtk -
      kBossDef * adjBossDef;
  } else if (otherSkillAction === EnumOtherSkillAction.powerSpecialAttack) {
    bossDamage =
      kTurn * kMonsterPower * kMonsterInt * adjMonsterInt -
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
  bbKParam: BBKState,
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
  const kBossAtk = Number(bbKParam.kBossAtk);
  const kBossInt = Number(bbKParam.kBossInt);
  const kMonsterDef = Number(bbKParam.kMonsterDef);
  const kMonsterMgr = Number(bbKParam.kMonsterMgr);
  const kBossPower = Number(bbKParam.kBossPower);
  let kTurn = Number(bbKParam.kTurn) * (turn - 1);
  if (turn === FIRST_TURN) kTurn = 1;
  if (kTurn > MAX_TURN_ADJ) kTurn = MAX_TURN_ADJ;

  const adjBossAtk = (bossAtk * bossAdj) / 100;
  const adjBossInt = (bossInt * bossAdj) / 100;
  const adjMonsterDef = (monsterDef * monsterAdj) / 100;
  const adjMonsterMgr = (monsterMgr * monsterAdj) / 100;

  let monsterDamage: number = 0;
  if (bossAction === EnumBossAction.powerAttack) {
    if (isPhysicalAttack) {
      monsterDamage =
        kTurn * kBossPower * kBossAtk * adjBossAtk -
        kMonsterDef * adjMonsterDef;
    } else {
      monsterDamage =
        kTurn * kBossPower * kBossInt * adjBossInt -
        kMonsterMgr * adjMonsterMgr;
    }
  } else if (bossAction === EnumBossAction.attack) {
    if (isPhysicalAttack) {
      monsterDamage =
        kTurn * kBossAtk * adjBossAtk - kMonsterDef * adjMonsterDef;
    } else {
      monsterDamage =
        kTurn * kBossInt * adjBossInt - kMonsterMgr * adjMonsterMgr;
    }
  } else if (bossAction === EnumBossAction.counterAttack) {
    if (isPhysicalAttack) {
      monsterDamage =
        kTurn * kBossPower * kBossAtk * adjBossAtk -
        kMonsterDef * adjMonsterDef;
    } else {
      monsterDamage =
        kTurn * kBossPower * kBossInt * adjBossInt -
        kMonsterMgr * adjMonsterMgr;
    }
  }

  if (defensed) monsterDamage *= 0.1;
  if (monsterDamage > MAX_MONSTER_DAMAGE) monsterDamage = MAX_MONSTER_DAMAGE;

  return Math.floor(monsterDamage) > 0 ? Math.floor(monsterDamage) : 1;
};

export const calcHealing = (
  usedSkillType: number,
  otherSkillAction: EnumOtherSkillAction,
  usedItemId: number,
  monsterInt: number,
  monsterAdj: number,
  bbKParam: BBKState,
): number => {
  if (otherSkillAction === EnumOtherSkillAction.fullHealing)
    return MAX_LIFE_POINT;
  if (usedItemId === EnumItem.healing) return MAX_LIFE_POINT;
  if (usedSkillType !== EnumSkillType.healing) return 0;

  // TODO: kは要調整!!!
  const kMonsterHealing = Number(bbKParam.kMonsterHealing);

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

export const buffMonster = (monsterAdj: number, bbKParam: BBKState): number => {
  // TODO: kは要調整!!!
  const kMonsterBuff = Number(bbKParam.kMonsterBuff);

  let newMonsterAdj = Math.floor(kMonsterBuff * monsterAdj);
  return newMonsterAdj > MAX_MONSTER_ADJ ? MAX_MONSTER_ADJ : newMonsterAdj;
};

export const debuffMonster = (
  monsterAdj: number,
  bbKParam: BBKState,
): number => {
  // TODO: kは要調整!!!
  const kMonsterDebuff = Number(bbKParam.kMonsterDebuff);

  let newMonsterAdj = Math.floor(kMonsterDebuff * monsterAdj);
  return newMonsterAdj < MIN_MONSTER_ADJ ? MIN_MONSTER_ADJ : newMonsterAdj;
};

export const buffBoss = (bossAdj: number, bbKParam: BBKState): number => {
  // TODO: kは要調整!!!
  const kBossBuff = Number(bbKParam.kBossBuff);

  let newBossAdj = Math.floor(kBossBuff * bossAdj);
  return newBossAdj > MAX_BOSS_ADJ ? MAX_BOSS_ADJ : newBossAdj;
};

export const debuffBoss = (bossAdj: number, bbKParam: BBKState): number => {
  // TODO: kは要調整!!!
  const kBossDebuff = Number(bbKParam.kBossDebuff);

  let newBossAdj = Math.floor(kBossDebuff * bossAdj);
  return newBossAdj < MIN_BOSS_ADJ ? MIN_BOSS_ADJ : newBossAdj;
};

export const getBossSkill = (
  bossSkills: string[],
  bossSign: number,
  bossAction: EnumBossAction,
): string => {
  if (bossAction === EnumBossAction.none) return "";
  const usedBossSkillIndex = (bossSign % 10) + bossAction * 10;
  return bossSkills[usedBossSkillIndex];
};

export const isBossSubAction = (
  bossSign: number,
  bossAction: number,
  usedItemId: number,
): boolean => {
  // 封印プロンプト使用時はサブアクションを行わない
  if (usedItemId === EnumItem.escape) return false;
  return Math.floor(bossSign / 10) % 10 !== bossAction;
};

export const getResultMsgIds = (
  usedItemId: number,
  bossAction: number,
  usedSkillType: number,
  usedOtherSkillAction: number,
  defensed: boolean,
): EnumBossBattleMsg[] => {
  if (usedItemId === EnumItem.escape)
    return [
      EnumBossBattleMsg.monsterItemEscapeNext,
      EnumBossBattleMsg.monsterItemEscape,
    ];
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
  let droppedRate = BOSS_ITEM_BUFF_DROPPED_RATE;
  if (random < droppedRate && !hasBuffItem) return EnumItem.buff;
  droppedRate += BOSS_ITEM_DEBUFF_DROPPED_RATE;
  if (random < droppedRate && !hasDebuffItem) return EnumItem.debuff;
  droppedRate += BOSS_ITEM_HEALING_DROPPED_RATE;
  if (random < droppedRate && !hasHealItem) return EnumItem.healing;
  droppedRate += BOSS_ITEM_ESCAPE_DROPPED_RATE;
  if (random < droppedRate && !hasEscapeItem) return EnumItem.escape;
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

export const isBuffDebuffMonster = (prevResultMsgId: number): boolean => {
  const p = prevResultMsgId;
  if (p === EnumBossBattleMsg.monsterItemBuff) return true;
  if (p === EnumBossBattleMsg.bossDebuff) return true;
  return false;
};

export const isBuffDebuffBoss = (prevResultMsgId: number): boolean => {
  const p = prevResultMsgId;
  if (p === EnumBossBattleMsg.bossBuff) return true;
  if (p === EnumBossBattleMsg.monsterItemDebuff) return true;
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

export const getQuoteType = (
  msgType: EnumBossBattleMsg,
): EnumBossBattleQuote => {
  if (msgType === EnumBossBattleMsg.monsterFightPhysicalAttack)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightSpecialAttack)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightHeal)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightOtherPhysicalAttack)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightOtherSpecialAttack)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightOtherDefense)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterFightOtherHeal)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterDefense)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterItemBuff)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterItemDebuff)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterItemHeal)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterItemEscape)
    return EnumBossBattleQuote.monster;
  if (msgType === EnumBossBattleMsg.monsterItemEscapeNext)
    return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossOneHitKill)
    return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossAttack) return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossPowerAttack)
    return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossCounterAttack)
    return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossBuff) return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossDebuff) return EnumBossBattleQuote.boss;
  if (msgType === EnumBossBattleMsg.bossDefense)
    return EnumBossBattleQuote.boss;
  return EnumBossBattleQuote.system;
};

export const isRareStatusContract = (status: StatusContract): boolean => {
  // TODO: ボスごとに切り替えられるようにする
  /*
   * ヨシュカ -> ステ合計115以上
   */

  let sumStatus = 0;
  sumStatus += status.hp;
  sumStatus += status.atk;
  sumStatus += status.def;
  sumStatus += status.inte;
  sumStatus += status.mgr;
  sumStatus += status.agl;
  return sumStatus >= 115;
};

export const isRareStatus = (status: Status): boolean => {
  // TODO: ボスごとに切り替えられるようにする
  /*
   * ヨシュカ -> ステ合計115以上
   */
  const statusContract: StatusContract = {
    hp: status.HP,
    atk: status.ATK,
    def: status.DEF,
    inte: status.INT,
    mgr: status.MGR,
    agl: status.AGL,
  };
  return isRareStatusContract(statusContract);
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
