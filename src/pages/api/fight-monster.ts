// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BattleContract } from "@/features/battle/api/contracts/BattleContract";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { calcStaminaFromMonsterId } from "@/features/stamina/utils/calcStamina";
import { getFightPrompt } from "@/lib/prompt";
import { RPC_URL } from "@/lib/wallet";
import console from "console";
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
    return res.status(400).json({ message: "Only POST" });
  if (!configuration.apiKey) {
    res.status(400).json({
      message:
        "OpenAI API key not configured, please follow instructions in README.md",
    });
    return;
  }

  const monsterId = req.body.monsterId;
  const language = req.body.language;
  const resurrectionPrompt = req.body.resurrectionPrompt;

  console.log(monsterId);

  const enemyId = await _getRandomEnemyId(monsterId);
  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  const enemyResurrectionPrompt = (
    await promptMonsters.getResurrectionPrompts([enemyId])
  )[0];
  const monsterExtensions = await promptMonsters.getMonsterExtensions([
    resurrectionPrompt,
    enemyResurrectionPrompt,
  ]);
  const monster = monsterExtensions[0];
  const enemy = monsterExtensions[1];
  const fightPrompt = getFightPrompt(
    monsterId,
    monster,
    enemyId,
    enemy,
    language,
  );
  console.log(fightPrompt);

  try {
    const stamina = await calcStaminaFromMonsterId(monsterId);
    console.log(`Remaining stamina: ${stamina}`);
    if (stamina < 1) {
      const message = "Stamina is not enough";
      console.log(message);
      return res.status(400).json({ message });
    }
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: fightPrompt,
        },
      ],
      temperature: 1.0,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);
    const battleResult = JSON.parse(
      completion.data.choices[0].message!.content,
    );
    if (
      battleResult.winnerId !== monsterId &&
      battleResult.winnerId !== "dummyID" &&
      battleResult.winnerId !== enemyId
    ) {
      battleResult.winnerId = "draw";
      console.log("The battle ended in a stalemate. -----------------");
      return res.status(500).json({ battleResult });
    }
    const battle = BattleContract.instance(RPC_URL.mchVerse);
    await battle.addSeasonBattleData(
      monsterId,
      battleResult.winnerId === enemyId ? enemyId : monsterId,
      battleResult.winnerId === enemyId ? monsterId : enemyId,
      battleResult.battleDescription,
    );
    return res.status(200).json({ battleResult });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

/**
 * Get random enemy monster id
 * @param monsterId monster id
 * @return {Promise<string>} random enemy monster id
 */
const _getRandomEnemyId = async (monsterId: string): Promise<string> => {
  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  const totalSupply = Number(await promptMonsters.getMonstersTotalSupply());
  if (totalSupply < 1) throw new Error("server: No enemy monsters.");
  let random: number;
  while (true) {
    random = Math.floor(Math.random() * totalSupply);
    if (monsterId === "") break;
    if (random !== Number(monsterId)) break;
  }
  return random.toString();
};
