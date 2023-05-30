// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptMonstersContract } from "@/features/monster/api/contracts/PromptMonstersContract";
import { getSkillDescPrompt } from "@/lib/prompt";
import { RPC_URL } from "@/lib/wallet";
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

  const monsterId = req.body.monsterId || "";

  try {
    const promptMonsters = PromptMonstersContract.instance(RPC_URL.mchVerse);
    const monster = (await promptMonsters.getMonsters([monsterId]))[0];
    const prompt = getSkillDescPrompt(monster.skills);
    console.log(prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1.0,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);

    const skillDescs = JSON.parse(completion.data.choices[0].message!.content);

    return res.status(200).json({ result: "" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
