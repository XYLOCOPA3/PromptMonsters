import { ethers } from "ethers";

export type MonsterDetails = {
  feature: string;
  name: string;
  flavor: string;
  skills: string[];
  lv: number;
  hp: number;
  atk: number;
  def: number;
  inte: number;
  mgr: number;
  agl: number;
};

export type MonsterExtensionDetails = {
  feature: string;
  name: string;
  flavor: string;
  skills: string[];
  lv: number;
  hp: number;
  atk: number;
  def: number;
  inte: number;
  mgr: number;
  agl: number;
  skillTypes: Array<number>;
  resurrectionPrompt: string;
};

export type BBState = {
  bossBattleStarted: boolean;
  bossBattleContinued: boolean;
  lp: number;
  turn: number;
  score: number;
  monsterAdj: number;
  bossAdj: number;
  bossSign: number;
  hasHealItem: boolean;
  hasBuffItem: boolean;
  hasDebuffItem: boolean;
  hasEscapeItem: boolean;
}

export const transformMonsterDetails = (monsterDetails: MonsterDetails) => {
  return {
    feature: monsterDetails.feature,
    name: monsterDetails.name,
    flavor: monsterDetails.flavor,
    skills: monsterDetails.skills,
    lv: monsterDetails.lv,
    hp: monsterDetails.hp,
    atk: monsterDetails.atk,
    def: monsterDetails.def,
    inte: monsterDetails.inte,
    mgr: monsterDetails.mgr,
    agl: monsterDetails.agl,
  };
};

export const transformBBState = (bbState: BBState) => {
  return {
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
  };
};

export const transformMonsterExtensionDetails = (monsterExtensionDetails: MonsterExtensionDetails) => {
  return {
    feature: monsterExtensionDetails.feature,
    name: monsterExtensionDetails.name,
    flavor: monsterExtensionDetails.flavor,
    skills: monsterExtensionDetails.skills,
    lv: monsterExtensionDetails.lv,
    hp: monsterExtensionDetails.hp,
    atk: monsterExtensionDetails.atk,
    def: monsterExtensionDetails.def,
    inte: monsterExtensionDetails.inte,
    mgr: monsterExtensionDetails.mgr,
    agl: monsterExtensionDetails.agl,
    skillTypes: monsterExtensionDetails.skillTypes,
    resurrectionPrompt: monsterExtensionDetails.resurrectionPrompt,
  };
};

export const emptyDetails = {
  feature: "",
  name: "",
  flavor: "",
  skills: [],
  lv: 0,
  hp: 0,
  atk: 0,
  def: 0,
  inte: 0,
  mgr: 0,
  agl: 0,
};

export const emptyExtensionDetails = {
  feature: "",
  name: "",
  flavor: "",
  skills: [],
  lv: 0,
  hp: 0,
  atk: 0,
  def: 0,
  inte: 0,
  mgr: 0,
  agl: 0,
  skillTypes: [],
  resurrectionPrompt: "",
};

export const FireMonsterDetails = {
  feature: "Fire, Monster, Attack",
  name: "FireMonster",
  flavor: "Fire",
  skills: ["FireBall1", "FireBall2", "FireBall3"],
  lv: 1,
  hp: 100,
  atk: 10,
  def: 10,
  inte: 10,
  mgr: 10,
  agl: 10,
};

export const FireMonsterNoExtensionDetails = {
  feature: "Fire, Monster, Attack",
  name: "FireMonster",
  flavor: "Fire",
  skills: ["FireBall1", "FireBall2", "FireBall3"],
  lv: 1,
  hp: 100,
  atk: 10,
  def: 10,
  inte: 10,
  mgr: 10,
  agl: 10,
  skillTypes: [0,0,0],
  resurrectionPrompt: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
};

export const FireMonsterExtensionDetails = {
  feature: "Fire, Monster, Attack",
  name: "FireMonster",
  flavor: "Fire",
  skills: ["FireBall1", "FireBall2", "FireBall3"],
  lv: 1,
  hp: 100,
  atk: 10,
  def: 10,
  inte: 10,
  mgr: 10,
  agl: 10,
  skillTypes: [101, 101, 101],
  resurrectionPrompt: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
};

export const WaterMonsterDetails = {
  feature: "Water, Monster, Defense",
  name: "WaterMonster",
  flavor: "Water",
  skills: ["WaterBlade1", "WaterBlade2", "WaterBlade3"],
  lv: 1,
  hp: 50,
  atk: 5,
  def: 20,
  inte: 10,
  mgr: 20,
  agl: 10,
};

export const WaterMonsterExtensionDetails = {
  feature: "Water, Monster, Defense",
  name: "WaterMonster",
  flavor: "Water",
  skills: ["WaterBlade1", "WaterBlade2", "WaterBlade3"],
  lv: 1,
  hp: 50,
  atk: 5,
  def: 20,
  inte: 10,
  mgr: 20,
  agl: 10,
  skillTypes: [101, 101, 101],
  resurrectionPrompt: "",
};

export const YoshkaExtensionDetails = {
  feature: "boss, monster, yoshka",
  name: "Yoshka",
  flavor: "boss",
  skills: ["YoshkaClaw", "YoshkaGuard", "Yoshka???"],
  lv: 10,
  hp: 100,
  atk: 10,
  def: 10,
  inte: 10,
  mgr: 10,
  agl: 10,
  skillTypes: [100, 1, 1],
  resurrectionPrompt: "0x0000000000000000000000000000000000000000",
};

export const monsterAdjForRp1 = {
  weaknessFeatureAdj: 100
}

export const defaultBBState = {
  bossBattleStarted: false,
  bossBattleContinued: false,
  lp: 0,
  turn: 0,
  score: 0,
  monsterAdj: 0,
  bossAdj: 0,
  bossSign: 0,
  hasHealItem: false,
  hasBuffItem: false,
  hasDebuffItem: false,
  hasEscapeItem: false,
}

export const initialBBState = {
  bossBattleStarted: true,
  bossBattleContinued: true,
  lp: 400,
  turn: 1,
  score: 0,
  monsterAdj: 100,
  bossAdj: 100,
  bossSign: 1,
  hasHealItem: false,
  hasBuffItem: false,
  hasDebuffItem: false,
  hasEscapeItem: false,
}

export const Rp1Turn1BBState = {
  bossBattleStarted: true,
  bossBattleContinued: false,
  lp: 350,
  turn: 1,
  score: 50,
  monsterAdj: 100,
  bossAdj: 100,
  bossSign: 1,
  hasHealItem: false,
  hasBuffItem: false,
  hasDebuffItem: false,
  hasEscapeItem: false,
}

export const Rp1Turn2BBState = {
  bossBattleStarted: true,
  bossBattleContinued: false,
  lp: 0,
  turn: 2,
  score: 70,
  monsterAdj: 100,
  bossAdj: 100,
  bossSign: 2,
  hasHealItem: false,
  hasBuffItem: false,
  hasDebuffItem: false,
  hasEscapeItem: false,
}

export const firstMonsterAdjForRp1 = 100;
export const secondMonsterAdjForRp1 = 200;

export const firstBossSignForRp1 = 1;
export const secondBossSignForRp1 = 2;

export const initialStamina = 3;

export const initialMintPrice = ethers.utils.parseEther("500");

export const externalLink = "https://prompt-monsters.com/";

export const battleLog =
  "闇に潜むグルームブルームが現れた。ユニコーンドラゴンは聖なる炎を放ち、光の爪で攻撃する。グルームブルームは影の一撃で反撃し、夜の視線でユニコーンドラゴンを苦しめた。しかし、ユニコーンドラゴンは天空の咆哮でグルームブルームを吹き飛ばした。";
