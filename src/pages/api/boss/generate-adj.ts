// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { EventKey } from "@/types/EventKey";
import { MonsterAdj } from "@/types/MonsterAdj";
import {
  hasBossWeaknessFeatures,
  isInvalidMonsterAdj,
} from "@/utils/bossBattleUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({
      message: "Only POST",
    });
  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "") {
    return res.status(400).json({
      message: "Unknown monster",
    });
  }
  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);

  try {
    const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);
    const monsterAdj = await bossBattle.getMonsterAdj(
      eventKey!,
      bbeId,
      resurrectionPrompt,
    );
    if (!isInvalidMonsterAdj(monsterAdj))
      return res.status(200).json({ monsterAdj });
    const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
    const monsterExtension = (
      await promptMonsters.getMonsterExtensions([resurrectionPrompt])
    )[0];
    let newMonsterAdj: MonsterAdj = { weaknessFeatureAdj: 100 };
    if (hasBossWeaknessFeatures(monsterExtension, eventKey))
      newMonsterAdj.weaknessFeatureAdj = 120;
    await bossBattle.setMonsterAdj(
      eventKey,
      bbeId,
      resurrectionPrompt,
      newMonsterAdj,
    );
    return res.status(200).json({ monsterAdj });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
