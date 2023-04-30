import { ethers } from "ethers";

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
