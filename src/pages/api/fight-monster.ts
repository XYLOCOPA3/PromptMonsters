// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BattleContract } from "@/features/battle/api/contracts/BattleContract";
import { PromptMonstersContract } from "@/features/monster/api/contracts/PromptMonstersContract";
import { calcStaminaFromMonsterId } from "@/features/stamina/utils/calcStamina";
import { RPC_URL } from "@/lib/wallet";
import { IPromptMonsters } from "@/typechain/PromptMonsters";
import { parseJson } from "@/utils/jsonParser";
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
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const monsterId = req.body.monsterId;
  const language = req.body.language;
  const resurrectionPrompt = req.body.resurrectionPrompt;

  const enemyId = await _getRandomEnemyId(monsterId);
  const promptMonsters = PromptMonstersContract.instance(
    RPC_URL.mchVerseTestnet,
  );
  let monsters: IPromptMonsters.MonsterStructOutput[] = [];
  console.log(monsterId);
  if (monsterId === "") {
    const results = await Promise.all([
      promptMonsters.getMonsterHistory(resurrectionPrompt),
      promptMonsters.getMonsters([enemyId]),
    ]);
    monsters.push(results[0]);
    monsters.push(results[1][0]);
  } else {
    monsters = await promptMonsters.getMonsters([monsterId, enemyId]);
  }
  const monster = monsters[0];
  const enemy = monsters[1];
  const fightPrompt = _getFightPrompt(
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
    const battleResult = parseJson(completion.data.choices[0].message!.content);
    if (
      battleResult.winnerId !== monsterId &&
      battleResult.winnerId !== "dummy" &&
      battleResult.winnerId !== enemyId
    ) {
      const message = "The battle ended in a stalemate.";
      console.log(message);
      return res.status(400).json({ message });
    }
    const battle = BattleContract.instance(RPC_URL.mchVerseTestnet);
    await battle.addSeasonBattleData(
      monsterId,
      battleResult.winnerId === enemyId ? enemyId : monsterId,
      battleResult.winnerId === enemyId ? monsterId : enemyId,
      battleResult.battleDesc,
    );
    res.status(200).json({ result: completion.data.choices });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
}

/**
 * Get fight prompt
 * @param monsterId monster id
 * @param monster monster struct
 * @param enemyId enemy monster id
 * @param enemy enemy struct
 * @param language output language
 * @return {Promise<string>} fight prompt
 */
const _getFightPrompt = (
  monsterId: string,
  monster: IPromptMonsters.MonsterStructOutput,
  enemyId: string,
  enemy: IPromptMonsters.MonsterStructOutput,
  language: string = "English",
): string => {
  return `m(You): id:${monsterId === "" ? "dummy" : monsterId} name:${
    monster.name
  } flavor:${monster.flavor} status: HP:${monster.hp} ATK:${monster.atk} DEF:${
    monster.def
  } INT:${monster.inte} MGR:${monster.mgr} AGL:${monster.agl} skills:[${
    monster.skills
  }]
m(Enemy): id:${enemyId} name:${enemy.name} flavor:${enemy.flavor} status: HP:${
    enemy.hp
  } ATK:${enemy.atk} DEF:${enemy.def} INT:${enemy.inte} MGR:${enemy.mgr} AGL:${
    enemy.agl
  } skills:[${enemy.skills}]

Generate battle results for ${monster.name} and ${
    enemy.name
  }. Use absolutely "skills", it is impossible to beat a monster with a huge difference in status, write in a novel-style (max 200 chars) & output in JSON.
key: "language" value: "${language}"
key: "battleDesc" value: string
key: "enemyName" value: string
key: "winnerId" value: string
key: "winnerName" value: string`;
};

/**
 * Get random enemy monster id
 * @param monsterId monster id
 * @return {Promise<string>} random enemy monster id
 */
const _getRandomEnemyId = async (monsterId: string): Promise<string> => {
  const promptMonsters = PromptMonstersContract.instance(
    RPC_URL.mchVerseTestnet,
  );
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
