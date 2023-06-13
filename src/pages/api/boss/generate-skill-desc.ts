// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { ServerPromptMonstersExtension } from "@/features/monster/api/contracts/ServerPromptMonstersExtension";
import { getSkillDescPrompt as getSkillTypePrompt } from "@/lib/prompt";
import { SkillType } from "@/types/SkillType";
import {
  getMonsterSkillsLimit4,
  getSkillTypesFromStr,
  hasUnknownSkill,
} from "@/utils/monsterUtils";
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

  if (!configuration.apiKey)
    return res.status(500).json({
      message: "OpenAI API key not configured",
    });

  let errorCnt = 0;

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "")
    return res.status(400).json({
      message: "Unknown monster",
    });

  const prefixLog = `/boss/generate-skill-desc: ${resurrectionPrompt}:`;

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);

  let monsterExtension: any;
  try {
    monsterExtension = (
      await promptMonsters.getMonsterExtensions([resurrectionPrompt])
    )[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }

  // 既にスキルタイプが存在するかチェック
  if (!hasUnknownSkill(monsterExtension.skillTypes))
    return res.status(200).json({
      skillTypes: monsterExtension.skillTypes,
    });

  // TODO: Unknownスキルのみ更新

  const prompt = getSkillTypePrompt(monsterExtension.skills);
  console.log(prefixLog, prompt);

  // スキルタイプをGPTで生成
  let completion: any;
  let skillTypes: number[];
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });
      console.log(prefixLog, completion.data.choices);
      console.log(prefixLog, completion.data.usage);
      const skillTypesStr = JSON.parse(
        completion.data.choices[0].message!.content,
      ) as SkillType[];
      skillTypes = getSkillTypesFromStr(skillTypesStr);
      console.log(prefixLog, skillTypes);
      errorCnt = 0;
      break;
    } catch (error) {
      errorCnt++;
      error instanceof Error
        ? console.error(error.message)
        : console.error(error);
      if (errorCnt >= MAX_ERROR_CNT) {
        if (error instanceof Error)
          return res.status(400).json({ message: error.message });
        return res.status(400).json({ message: error });
      }
    }
  }

  const promptMonstersExtension = ServerPromptMonstersExtension.instance(
    RPC_URL.mchVerse,
  );

  // スキルタイプを更新
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await promptMonstersExtension.setBatchSkillTypes(
        [resurrectionPrompt],
        [getMonsterSkillsLimit4(monsterExtension.skills)],
        [skillTypes],
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

  return res.status(200).json({ skillTypes });
}
