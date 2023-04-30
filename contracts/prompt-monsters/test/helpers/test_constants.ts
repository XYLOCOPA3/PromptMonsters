import { ethers } from "ethers";

export type MonsterDetails = {
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
  maxSkills: number;
  maxSkillsSet: number;
};

export const transformMonsterDetails = (monsterDetails: MonsterDetails) => {
  return {
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
    maxSkills: monsterDetails.maxSkills,
    maxSkillsSet: monsterDetails.maxSkillsSet,
  };
};

export const emptyDetails = {
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
  maxSkills: 0,
  maxSkillsSet: 0,
};

export const FireMonsterDetails = {
  name: "FireMonster",
  flavor: "Fire",
  skills: ["FireBall1", "FireBall2", "FireBall3"],
  lv: 10,
  hp: 100,
  atk: 10,
  def: 10,
  inte: 10,
  mgr: 10,
  agl: 10,
  maxSkills: 10,
  maxSkillsSet: 10,
};

export const WaterMonsterDetails = {
  name: "WaterMonster",
  flavor: "Water",
  skills: ["WaterBlade1", "WaterBlade2", "WaterBlade3"],
  lv: 20,
  hp: 50,
  atk: 5,
  def: 20,
  inte: 10,
  mgr: 20,
  agl: 10,
  maxSkills: 10,
  maxSkillsSet: 10,
};

export const initialStamina = 3;

export const initialMintPrice = ethers.utils.parseEther("100");

export const externalLink = "https://prompt-monsters.com/";

export const battleLog =
  "闇に潜むグルームブルームが現れた。ユニコーンドラゴンは聖なる炎を放ち、光の爪で攻撃する。グルームブルームは影の一撃で反撃し、夜の視線でユニコーンドラゴンを苦しめた。しかし、ユニコーンドラゴンは天空の咆哮でグルームブルームを吹き飛ばした。";
