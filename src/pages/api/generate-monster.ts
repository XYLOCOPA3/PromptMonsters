// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { LANGUAGES } from "@/const/language";
import { MAX_FEATURES_CHAR } from "@/const/monster";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { getGeneratingPrompt } from "@/lib/prompt";
import { FeatureErrorType } from "@/types/FeatureErrorType";
import { checkFeature } from "@/utils/validation";
import { ethers } from "ethers";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({
      message: "Only POST",
    });

  if (!configuration.apiKey) {
    return res.status(500).json({
      message: "OpenAI API key not configured",
    });
  }

  let errorCnt = 0;

  const feature = req.body.feature || "";
  const language = req.body.language || "";
  if (!LANGUAGES.includes(language))
    return res.status(400).json({ message: "Invalid language." });

  const result = checkFeature(feature);
  if (result !== FeatureErrorType.ok) {
    switch (result) {
      case FeatureErrorType.noFeature:
        console.error("Do not empty feature");
        return res.status(400).json({
          message: "Do not empty feature",
        });
      case FeatureErrorType.characterLimit:
        console.error(
          `Too many characters.\n\nPlease limit the number of characters to ${MAX_FEATURES_CHAR} for single-byte characters and ${
            MAX_FEATURES_CHAR / 3
          } for double-byte characters.`,
        );
        return res.status(400).json({
          message: `Too many characters.\n\nPlease limit the number of characters to ${MAX_FEATURES_CHAR} for single-byte characters and ${
            MAX_FEATURES_CHAR / 3
          } for double-byte characters.`,
        });
      case FeatureErrorType.usingSymbol:
        console.error("Do not use symbol");
        return res.status(400).json({
          message: "Do not use symbol",
        });
      case FeatureErrorType.usingNum:
        console.error("Do not use number");
        return res.status(400).json({
          message: "Do not use number",
        });
      case FeatureErrorType.usingNGWord:
        console.error("Do not use NG word");
        return res.status(400).json({
          message: "Do not use NG word",
        });
      default:
        console.error("Unknown error");
        return res.status(400).json({
          message: "Unknown error",
        });
    }
  }
  const resurrectionPrompt = ethers.Wallet.createRandom().address;
  console.log("Create Monster Resurrection Prompt: ", resurrectionPrompt);
  const prefixLog = `/generate-monster: ${resurrectionPrompt}:`;

  const generatePrompt = getGeneratingPrompt(feature, language);
  console.log(prefixLog, generatePrompt);

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  let monster: any;
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [{ role: "user", content: generatePrompt }],
        temperature: 1.0,
      });
      console.log(completion.data.choices);
      console.log(completion.data.usage);
      monster = _getMonster(
        completion.data.choices[0].message!.content,
        language,
      );
      errorCnt = 0;
      break;
    } catch (error) {
      errorCnt++;
      error instanceof Error
        ? console.error(prefixLog, error.message)
        : console.error(prefixLog, error);
      if (errorCnt >= MAX_ERROR_CNT) {
        if (error instanceof Error)
          return res.status(400).json({ message: error.message });
        return res.status(400).json({ message: error });
      }
    }
  }
  console.log("Fixed status ---------------------------");
  console.log(monster);

  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await promptMonsters.generateMonster(
        resurrectionPrompt,
        monster,
        feature,
      );
      errorCnt = 0;
      break;
    } catch (error) {
      errorCnt++;
      error instanceof Error
        ? console.error(prefixLog, error.message)
        : console.error(prefixLog, error);
      if (errorCnt >= MAX_ERROR_CNT) {
        if (error instanceof Error)
          return res.status(400).json({ message: error.message });
        return res.status(400).json({ message: error });
      }
      // "ERROR_WAIT_TIME" ms待機
      await new Promise((resolve) => setTimeout(resolve, ERROR_WAIT_TIME));
    }
  }

  return res.status(200).json({ monster, resurrectionPrompt });
}

/**
 * Get monster
 * @param content content
 * @param language language
 * @return {any} monster
 */
const _getMonster = (content: any, language: string): any => {
  // keyを誤って翻訳してしまっている場合は正す
  const newContent = _replaceLanguage(content, language);

  // jsonに変換
  console.log("Parse json ---------------------------");
  let monster = JSON.parse(newContent);
  console.log(monster);

  // nameとflavorのチェック
  if (monster.name === "" || monster.flavor === "")
    throw new Error("Monster name or flavor is empty");

  // スキルを4つに制限
  monster = _limitSkillsToFourForMonster(monster);

  // ステータスを整数にする
  monster = _floorStatus(monster);

  // ステータスが最小値より小さいなら最小値にする
  monster = _fixMinStatus(monster);

  // ステータスが規定値を超えていない場合は即抜け
  if (!_isOverStatus(monster.status)) return monster;

  // ステータスを規定値に補正する
  monster = _correctMaxStatus(monster);

  return monster;
};

/**
 * Correct skills
 * @param monster monster
 * @return {string} monster
 */
const _limitSkillsToFourForMonster = (monster: any): any => {
  if (monster.skills.length <= 4) return monster;
  const newSkills = [];
  for (let i = 0; i < monster.skills.length; i++) {
    newSkills.push(monster.skills[i]);
    if (i === 3) break;
  }
  monster.skills = newSkills;
  console.log("Adjust skills ---------------------------");
  console.log(monster);
  return monster;
};

/**
 * Correct max status
 * @param monster monster
 * @return {string} monster
 */
const _correctMaxStatus = (monster: any): any => {
  console.log("over status!!! ---------------------------");
  monster.status.HP = Math.floor(Math.random() * 20) + 1;
  monster.status.ATK = Math.floor(Math.random() * 10) + 1;
  monster.status.DEF = Math.floor(Math.random() * 10) + 1;
  monster.status.INT = Math.floor(Math.random() * 10) + 1;
  monster.status.MGR = Math.floor(Math.random() * 10) + 1;
  monster.status.AGL = Math.floor(Math.random() * 10) + 1;
  return monster;
};

/**
 * Replace language
 * @param content content
 * @param language language
 * @return {string} new content
 */
const _replaceLanguage = (content: any, language: string): string => {
  let newContent = content;
  switch (language) {
    case LANGUAGES[1]:
      newContent = newContent.replace("名前", "name");
      newContent = newContent.replace("説明", "flavor");
      newContent = newContent.replace("状態", "status");
      newContent = newContent.replace("体力", "HP");
      newContent = newContent.replace("ヒットポイント", "HP");
      newContent = newContent.replace("健康度", "HP");
      newContent = newContent.replace("生命力", "HP");
      newContent = newContent.replace("耐久力", "HP");
      newContent = newContent.replace("攻撃力", "ATK");
      newContent = newContent.replace("防御力", "DEF");
      newContent = newContent.replace("知力", "INT");
      newContent = newContent.replace("知性", "INT");
      newContent = newContent.replace("精神力", "MGR");
      newContent = newContent.replace("魔力", "MGR");
      newContent = newContent.replace("素早さ", "AGL");
      newContent = newContent.replace("敏捷性", "AGL");
      newContent = newContent.replace("スキル", "skills");
      newContent = newContent.replace("架空の存在", "isFiction");
      newContent = newContent.replace("実在しない", "isExisting");
      return newContent;
    default:
      return newContent;
  }
};

/**
 * Is over status
 * @param status status
 * @return {boolean} is over status
 */
const _isOverStatus = (status: any): boolean => {
  if (status.HP > 40) return true;
  if (status.ATK > 20) return true;
  if (status.DEF > 20) return true;
  if (status.INT > 20) return true;
  if (status.MGR > 20) return true;
  if (status.AGL > 20) return true;
  return _isOverSumStatus(status);
};

/**
 * Is over sum status
 * @param status status
 * @return {boolean} is over status
 */
const _isOverSumStatus = (status: any): boolean => {
  let sumStatus = 0;
  sumStatus += status.HP;
  sumStatus += status.ATK;
  sumStatus += status.DEF;
  sumStatus += status.INT;
  sumStatus += status.MGR;
  sumStatus += status.AGL;
  const std = 80 + Math.floor(Math.random() * 11);
  console.log("sumStatus: " + sumStatus);
  console.log("std: " + std);
  if (sumStatus > std) return true;
  return false;
};

/**
 * Correct below min value
 * @param monster monster
 * @return {any} monster
 */
const _fixMinStatus = (monster: any): any => {
  if (monster.status.HP < 2) monster.status.HP = 2;
  if (monster.status.ATK < 1) monster.status.ATK = 1;
  if (monster.status.DEF < 1) monster.status.DEF = 1;
  if (monster.status.INT < 1) monster.status.INT = 1;
  if (monster.status.MGR < 1) monster.status.MGR = 1;
  if (monster.status.AGL < 1) monster.status.AGL = 1;
  return monster;
};

/**
 * Floor status
 * @param monster monster
 * @return {any} monster
 */
const _floorStatus = (monster: any): any => {
  const newMonster = monster;
  newMonster.status.HP = Math.floor(newMonster.status.HP);
  newMonster.status.ATK = Math.floor(newMonster.status.ATK);
  newMonster.status.DEF = Math.floor(newMonster.status.DEF);
  newMonster.status.INT = Math.floor(newMonster.status.INT);
  newMonster.status.MGR = Math.floor(newMonster.status.MGR);
  newMonster.status.AGL = Math.floor(newMonster.status.AGL);
  return newMonster;
};
