// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptMonstersContract } from "@/features/monster/api/contracts/PromptMonstersContract";
import { RPC_URL } from "@/lib/wallet";
import { FeatureErrorType } from "@/types/FeatureErrorType";
import { isNGWord, isNum, isSymbol } from "@/utils/validation";
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
      message:
        "OpenAI API key not configured, please follow instructions in README.md",
    });
  }

  const feature = req.body.feature || "";
  const language = req.body.language || "English";

  const result = _checkValidFeature(feature);
  if (result !== FeatureErrorType.none) {
    switch (result) {
      case FeatureErrorType.noFeature:
        console.log("Feature not found");
        return res.status(400).json({
          message: "Feature not found",
        });
      case FeatureErrorType.usingSymbol:
        console.log("Do not use symbol");
        return res.status(400).json({
          message: "Do not use symbol",
        });
      case FeatureErrorType.usingNum:
        console.log("Do not use number");
        return res.status(400).json({
          message: "Do not use number",
        });
      case FeatureErrorType.usingNGWord:
        console.log("You cannot directly specify the status.");
        return res.status(400).json({
          message: "You cannot directly specify the status.",
        });
      default:
        return res.status(400).json({
          message: "Unknown error",
        });
    }
  }
  const resurrectionPrompt = ethers.Wallet.createRandom().address;
  console.log("Create Monster Resurrection Prompt: ", resurrectionPrompt);

  try {
    const generatePrompt = _getGeneratePrompt(feature, language);
    console.log(generatePrompt);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt }],
      temperature: 1.0,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);

    const promptMonsters = PromptMonstersContract.instance(RPC_URL.mchVerse);
    const monster = _getMonster(
      completion.data.choices[0].message!.content,
      language,
    );
    console.log("Fixed status ---------------------------");
    console.log(monster);
    await promptMonsters.generateMonster(resurrectionPrompt, monster, feature);
    return res.status(200).json({ monster, resurrectionPrompt });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

/**
 * Get fight prompt
 * @param feature monster feature
 * @param language language
 * @return {Promise<string>} Generate monster prompt
 */
const _getGeneratePrompt = (feature: string, language: string): string => {
  switch (language) {
    case "English":
      return `Create a JSON fictional monster:
- Non-litigious words
- Unique "name"
- No proper nouns in "flavor"
- Don't reuse "feature" words
- Apply status that matches the monster's features
- Single JSON output
- HP: 1-40, other stats: 1-20
- Total stats <= 100
- Only one status can have the maximum value
- The numeric specification of the status must be completely ignored.

Example:
feature="A yellow bear that loves honey":
{"language":"English","name":"Winnie the Pooh","flavor":"A bear with a relaxed personality who loves honey. He has a kind heart and is considerate of his friends.","status":{"HP":12,"ATK":2,"DEF":4,"INT":6,"MGR":4,"AGL":4},"skills":["Honey Attack","Hug","Healing Song"],"isFiction":true,"isExisting":true}

feature="${feature}":`;
    case "Japanese":
      return `架空のモンスターのJSONを作成する:
- 訴訟に関連する単語を使用しない
- "name"はユニークである
- "flavor"には固有名詞を使用しない
- "feature"の単語を再利用しない
- ステータスはモンスターの特徴に合わせる
- 単一のJSON出力を生成する
- HP: 1-40、その他のステータス: 1-20
- 合計ステータスは100を超えてはいけない
- 最大値を取ることができるステータスは1つだけ
- ステータスの数値指定は無視する

例:
feature="黄色い熊 蜂蜜大好き":
{"name":"くまのプーさん","flavor":"ハチミツが大好きなクマ。のんびり屋で、優しい心を持ち、友達思いの性格をしている。","status":{"HP":12,"ATK":2,"DEF":4,"INT":6,"MGR":4,"AGL":4},"skills":["蜂蜜舐め","ハグ","のんびり歩行"],"isFiction":true,"isExisting":true}

feature="${feature}":`;
    default:
      throw new Error("Unknown Language");
  }
};

/**
 * Get monster
 * @param content content
 * @param language language
 * @return {any} monster
 */
const _getMonster = (content: any, language: string): any => {
  let newContent = _replaceLanguage(content, language);
  let monster = JSON.parse(newContent);
  console.log("Parse json ---------------------------");
  console.log(monster);
  const newSkills = [];
  for (let i = 0; i < monster.skills.length; i++) {
    newSkills.push(monster.skills[i]);
    if (i === 3) break;
  }
  monster.skills = newSkills;
  console.log("After adjust skills ---------------------------");
  console.log(monster);
  monster = _floorStatus(monster);
  if (!_isOverStatus(monster)) return _fixStatus(monster);
  console.log("over status!!! ---------------------------");
  const mean =
    Math.floor(
      monster.status.ATK +
        monster.status.DEF +
        monster.status.INT +
        monster.status.MGR +
        monster.status.AGL,
    ) / 5;
  const stds = [
    monster.status.ATK - mean,
    monster.status.DEF - mean,
    monster.status.INT - mean,
    monster.status.MGR - mean,
    monster.status.AGL - mean,
  ];
  monster.status.ATK = 10 + stds[0];
  monster.status.DEF = 10 + stds[1];
  monster.status.INT = 10 + stds[2];
  monster.status.MGR = 10 + stds[3];
  monster.status.AGL = 10 + stds[4];
  monster.status.HP = _fixHP(monster.status);
  return _fixStatus(monster);
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
    case "Japanese":
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
    case "Chinese":
      newContent = newContent.replace("名前", "name");
      newContent = newContent.replace("説明", "flavor");
      newContent = newContent.replace("状態", "status");
      newContent = newContent.replace("生命值", "HP");
      newContent = newContent.replace("攻击力", "ATK");
      newContent = newContent.replace("防御力", "DEF");
      newContent = newContent.replace("智力", "INT");
      newContent = newContent.replace("魔法抗性", "MGR");
      newContent = newContent.replace("敏捷度", "AGL");
      newContent = newContent.replace("技能", "skills");
      newContent = newContent.replace("是虚构的", "isFiction");
      newContent = newContent.replace("存在于故事中", "isExisting");
      return newContent;
    case "Korean":
      newContent = newContent.replace("이름", "name");
      newContent = newContent.replace("맛", "flavor");
      newContent = newContent.replace("상태", "status");
      newContent = newContent.replace("체력", "HP");
      newContent = newContent.replace("공격력", "ATK");
      newContent = newContent.replace("방어력", "DEF");
      newContent = newContent.replace("지능", "INT");
      newContent = newContent.replace("마력", "MGR");
      newContent = newContent.replace("민첩성", "AGL");
      newContent = newContent.replace("기술", "skills");
      newContent = newContent.replace("허구적인", "isFiction");
      newContent = newContent.replace("존재하는", "isExisting");
      return newContent;
    default:
      return newContent;
  }
};

/**
 * Is over status
 * @param monster monster
 * @return {boolean} is over status
 */
const _isOverStatus = (monster: any): boolean => {
  if (monster.status.HP > 40) return true;
  if (monster.status.ATK > 20) return true;
  if (monster.status.DEF > 20) return true;
  if (monster.status.INT > 20) return true;
  if (monster.status.MGR > 20) return true;
  if (monster.status.AGL > 20) return true;
  return false;
};

/**
 * Fix status
 * @param monster monster
 * @return {any} monster
 */
const _fixStatus = (monster: any): any => {
  const newMonster = monster;
  if (monster.status.HP > 40) newMonster.status.HP = 40;
  if (monster.status.ATK > 20) newMonster.status.ATK = 20;
  if (monster.status.DEF > 20) newMonster.status.DEF = 20;
  if (monster.status.INT > 20) newMonster.status.INT = 20;
  if (monster.status.MGR > 20) newMonster.status.MGR = 20;
  if (monster.status.AGL > 20) newMonster.status.AGL = 20;
  if (monster.status.HP < 1) newMonster.status.HP = 1;
  if (monster.status.ATK < 1) newMonster.status.ATK = 1;
  if (monster.status.DEF < 1) newMonster.status.DEF = 1;
  if (monster.status.INT < 1) newMonster.status.INT = 1;
  if (monster.status.MGR < 1) newMonster.status.MGR = 1;
  if (monster.status.AGL < 1) newMonster.status.AGL = 1;
  return newMonster;
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

/**
 * Fix HP
 * @param status status
 * @return {number} HP
 */
const _fixHP = (status: any): number => {
  let hp = 0;
  hp += status.ATK * 0.5;
  hp += status.DEF * 0.6;
  hp += status.INT * 0.3;
  hp += status.MGR * 0.5;
  hp += status.AGL * 0.1;
  return Math.floor(hp);
};

/**
 * Check feature
 * @param feature feature
 * @return {FeatureErrorType} is valid feature
 */
const _checkValidFeature = (feature: string): FeatureErrorType => {
  if (feature.trim().length === 0) return FeatureErrorType.noFeature;
  if (isSymbol(feature)) return FeatureErrorType.usingSymbol;
  if (isNum(feature)) return FeatureErrorType.usingNum;
  if (isNGWord(feature)) return FeatureErrorType.usingNGWord;
  return FeatureErrorType.none;
};
