// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
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
  const prefixLog = `/boss/generate-adj: ${resurrectionPrompt}:`;

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  let results: any;
  try {
    results = await Promise.all([
      bossBattle.getMonsterAdj(eventKey!, bbeId, resurrectionPrompt),
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }

  const monsterAdj = results[0];
  const monsterExtension = results[1][0];

  // 補正値計算
  if (isInvalidMonsterAdj(monsterAdj))
    return res.status(200).json({ monsterAdj });
  let newMonsterAdj: MonsterAdj = { weaknessFeatureAdj: 100 };
  if (
    hasBossWeaknessFeatures(
      eventKey,
      monsterExtension.feature,
      monsterExtension.name,
      monsterExtension.flavor,
    ) !== null
  )
    newMonsterAdj.weaknessFeatureAdj = 120;

  // 補正値更新
  let errorCnt = 0;
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await bossBattle.setMonsterAdj(
        eventKey,
        bbeId,
        resurrectionPrompt,
        newMonsterAdj,
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

  console.log(prefixLog, "newMonsterAdj = ", newMonsterAdj);

  return res.status(200).json({ monsterAdj: newMonsterAdj });
}
