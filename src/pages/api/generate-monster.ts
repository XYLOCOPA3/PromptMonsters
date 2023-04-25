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
    const monster = _getMonster(completion.data.choices[0].message!.content);
    console.log(monster);
    await promptMonsters.generateMonster(userId, monster);

    // return res.status(200).json({ result: completion.data.choices });
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
- Single JSON output
- (Translate values to ${language} (keys untranslated))

Example:
feature="A yellow bear that loves honey":
{"name":"Winnie the Pooh","flavor":"A bear with a relaxed personality who loves honey. He has a kind heart and is considerate of his friends.","status":{"HP":10,"ATK":1,"DEF":3,"INT":2,"MGR":4,"AGL":1},"skills":["Honey Attack","Hug","Healing Song"],"isFiction":true,"isExisting":true}

feature="${feature}":`;
};

/**
 * Get fight prompt
 * @param content content
 * @return {Promise<string>} random enemy monster id
 */
const _getMonster = (content: any): any => {
  const monster = parseJson(content);
  console.log(monster);
  if (monster.status.HP > 43) {
    monster.status.HP = (monster.status.HP % 43) + 1;
  }
  if (monster.status.ATK > 18) {
    monster.status.ATK = (monster.status.ATK % 18) + 1;
  }
  if (monster.status.DEF > 14) {
    monster.status.DEF = (monster.status.DEF % 14) + 1;
  }
  if (monster.status.INT > 16) {
    monster.status.INT = (monster.status.INT % 16) + 1;
  }
  if (monster.status.MGR > 12) {
    monster.status.MGR = (monster.status.MGR % 12) + 1;
  }
  if (monster.status.AGL > 15) {
    monster.status.AGL = (monster.status.AGL % 15) + 1;
  }
  return monster;
};
