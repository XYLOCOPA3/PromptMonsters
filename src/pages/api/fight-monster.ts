// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { LANGUAGES } from "@/const/language";
import { BattleContract } from "@/features/battle/api/contracts/BattleContract";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { calcStaminaFromMonsterId } from "@/features/stamina/utils/calcStamina";
import { getFightPrompt } from "@/lib/prompt";
import { IPromptMonstersExtension } from "@/typechain/PromptMonstersExtension";
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

  if (!configuration.apiKey)
    return res.status(500).json({
      message:
        "OpenAI API key not configured, please follow instructions in README.md",
    });

  let errorCnt = 0;

  const language = req.body.language || "";
  if (!LANGUAGES.includes(language))
    return res.status(400).json({ message: "Invalid language." });

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "")
    return res.status(400).json({ message: "Invalid resurrectionPrompt." });

  const prefixLog = `/fight-monster: ${resurrectionPrompt}:`;

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);

  let monsterId: string;
  let results: any;
  try {
    monsterId = (await promptMonsters.getTokenIds([resurrectionPrompt]))[0];
    results = await Promise.all([
      calcStaminaFromMonsterId(monsterId),
      _getRandomEnemyId(monsterId),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }
  const stamina = results[0];
  const enemyId = results[1];
  console.log(prefixLog, `Remaining stamina: ${stamina}`);
  console.log(prefixLog, `enemyId = ${enemyId}`);

  // スタミナチェック
  if (stamina < 1) {
    const message = prefixLog + "Stamina is not enough";
    console.error(message);
    return res.status(400).json({ message });
  }

  let monsterExtensions: IPromptMonstersExtension.MonsterExtensionStructOutput[];
  let enemyResurrectionPrompt: string;
  try {
    enemyResurrectionPrompt = (
      await promptMonsters.getResurrectionPrompts([enemyId])
    )[0];
    monsterExtensions = await promptMonsters.getMonsterExtensions([
      resurrectionPrompt,
      enemyResurrectionPrompt,
    ]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }
  const monsterExtension = monsterExtensions[0];
  const enemyExtension = monsterExtensions[1];
  const fightPrompt = getFightPrompt(
    monsterExtension,
    enemyExtension,
    language,
  );
  console.log(prefixLog, "fightPrompt = ", fightPrompt);

  let battleResult: any;
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
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
      battleResult = JSON.parse(completion.data.choices[0].message!.content);
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
  if (
    battleResult.winnerId !== monsterExtension.resurrectionPrompt &&
    battleResult.winnerId !== enemyExtension.resurrectionPrompt
  ) {
    battleResult.winnerId = "draw";
    console.log("The battle ended in a stalemate. -----------------");
    return res.status(500).json({ battleResult });
  }

  const battle = BattleContract.instance(RPC_URL.mchVerse);
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await battle.addSeasonBattleData(
        monsterId,
        battleResult.winnerId === enemyExtension.resurrectionPrompt
          ? enemyId
          : monsterId,
        battleResult.winnerId === enemyExtension.resurrectionPrompt
          ? monsterId
          : enemyId,
        battleResult.battleDescription,
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
  return res.status(200).json({ battleResult });
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
