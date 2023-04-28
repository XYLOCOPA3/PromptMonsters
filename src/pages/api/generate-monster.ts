// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptMonstersContract } from "@/features/monster/api/contracts/PromptMonstersContract";
import { RPC_URL } from "@/lib/wallet";
import { parseJson } from "@/utils/jsonParser";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const userId = req.body.userId || "";
  const feature = req.body.feature || "";
  const language = req.body.language || "English";
  if (feature.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid feature",
      },
    });
    return;
  }

  try {
    const generatePrompt = _getGeneratePrompt(feature, language);
    console.log(generatePrompt);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt }],
      temperature: 0.3,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);

    const promptMonsters = PromptMonstersContract.instance(
      RPC_URL.mchVerseTestnet,
    );
    const monster = _getMonster(
      completion.data.choices[0].message!.content,
      language,
    );
    console.log(monster);
    await promptMonsters.generateMonster(userId, monster);
    return res.status(200).json({ monster });
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
  return `Create a JSON fictional monster:
- Non-litigious words
- Unique "name"
- No proper nouns in "flavor"
- Don't reuse "feature" words
- Apply status that matches the monster's features
- Single JSON output
- (Translate values to ${language} (keys untranslated))

Example:
feature="A yellow bear that loves honey":
{"name":"Winnie the Pooh","flavor":"A bear with a relaxed personality who loves honey. He has a kind heart and is considerate of his friends.","status":{"HP":10,"ATK":2,"DEF":4,"INT":6,"MGR":4,"AGL":4},"skills":["Honey Attack","Hug","Healing Song"],"isFiction":true,"isExisting":true}

feature="${feature}":`;
};

/**
 * Get monster
 * @param content content
 * @param language language
 * @return {any} monster
 */
const _getMonster = (content: any, language: string): any => {
  let newContent = _replaceLanguage(content, language);
  const monster = parseJson(newContent);
  if (!_isOverStatus(monster)) return monster;
  console.log(monster);
  const mean =
    (monster.status.ATK +
      monster.status.DEF +
      monster.status.INT +
      monster.status.MGR +
      monster.status.AGL) /
    5;
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

  const randomNum = Math.floor(Math.random() * 5);
  if (randomNum === 0) monster.status.HP = monster.status.ATK * 2;
  if (randomNum === 1) monster.status.HP = monster.status.DEF * 2;
  if (randomNum === 2) monster.status.HP = monster.status.INT * 2;
  if (randomNum === 3) monster.status.HP = monster.status.MGR * 2;
  if (randomNum === 4) monster.status.HP = monster.status.AGL * 2;
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
      newContent = newContent.replace("攻撃力", "ATK");
      newContent = newContent.replace("防御力", "DEF");
      newContent = newContent.replace("地力", "INT");
      newContent = newContent.replace("魔法防御力", "MGR");
      newContent = newContent.replace("素早さ", "AGL");
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
  if (monster.status.HP > 100) return true;
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
const _fixStatus = (monster: any): boolean => {
  const newMonster = monster;
  if (monster.status.HP > 100) newMonster.status.HP = 100;
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
