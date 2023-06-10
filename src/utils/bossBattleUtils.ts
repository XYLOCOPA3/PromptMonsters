import { BOSS_WEAKNESS_FEATURES } from "@/const/bossBattle";
import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { MonsterModel } from "@/models/MonsterModel";
import { IPromptMonstersExtension } from "@/typechain/PromptMonsters";
import { BBState } from "@/types/BBState";
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
): Promise<BBState> => {
  const bossBattle = await ClientBossBattle.instance();
  const bbState = await bossBattle.getBBState(resurrectionPrompt);
  if (bbState.bossBattleStarted) return bbState;
  let res: any;
  try {
    res = await axios.post("/api/boss/start", {
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
  return res.data.newBBState;
};

// TODO: Enumにしてどの値が不正かを判断できるようにする
export const isInvalidMonsterAdj = (monsterAdj: MonsterAdj): boolean => {
  if (monsterAdj.weaknessFeatureAdj <= 0) return true;
  return false;
};

export const calcMonsterAdj = (monsterAdj: MonsterAdj): number => {
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
  if (random < 10) {
    bossSign = random;
  } else if (10 <= random && random < 40) {
    // 10-19の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 10;
  } else if (40 <= random && random < 60) {
    // 20-29の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 20;
  } else if (60 <= random && random < 70) {
    // 30-39の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 30;
  } else if (70 <= random && random < 80) {
    // 40-49の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 40;
  } else if (80 <= random && random < 90) {
    // 50-59の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 50;
  } else {
    // 60-69の乱数を生成してbossSignに格納
    bossSign = Math.floor(Math.random() * 10) + 60;
  }
  return bossSign;
};
