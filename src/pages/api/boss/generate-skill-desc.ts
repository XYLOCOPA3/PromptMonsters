// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptMonstersContract } from "@/features/monster/api/contracts/PromptMonstersContract";
import { ServerPromptMonstersExtension } from "@/features/monster/api/contracts/ServerPromptMonstersExtension";
import { getSkillDescPrompt as getSkillTypePrompt } from "@/lib/prompt";
import { RPC_URL } from "@/lib/wallet";
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
  if (!configuration.apiKey) {
    return res.status(500).json({
      message: "OpenAI API key not configured",
    });
  }
  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "") {
    return res.status(400).json({
      message: "Unknown monster",
    });
  }

  try {
    const promptMonsters = PromptMonstersContract.instance(RPC_URL.mchVerse);
    const monsterExtension = (
      await promptMonsters.getMonsterExtensions([resurrectionPrompt])
    )[0];
    if (!hasUnknownSkill(monsterExtension.skillTypes)) {
      return res.status(400).json({
        message: "This monster has no unknown skill",
      });
    }
    // TODO: Unknownスキルのみ更新
    const prompt = getSkillTypePrompt(monsterExtension.skills);
    console.log(prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1.0,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);

    const skillTypesStr = JSON.parse(
      completion.data.choices[0].message!.content,
    ) as SkillType[];
    const skillTypes = getSkillTypesFromStr(skillTypesStr);
    console.log(skillTypes);
    const promptMonstersExtension = ServerPromptMonstersExtension.instance(
      RPC_URL.mchVerse,
    );
    console.log(getMonsterSkillsLimit4(monsterExtension.skills));
    await promptMonstersExtension.setBatchSkillTypes(
      [resurrectionPrompt],
      [getMonsterSkillsLimit4(monsterExtension.skills)],
      [skillTypes],
    );

    return res.status(200).json({ skillTypes });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
