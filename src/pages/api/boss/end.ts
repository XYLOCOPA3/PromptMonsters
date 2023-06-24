// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { EventKey } from "@/types/EventKey";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({
      message: "Only POST",
    });

  const endTime = new Date(Number(process.env.BOSS_BATTLE_END_TIME));
  const now = new Date();
  if (now > endTime) {
    return res.status(400).json({
      message: "Boss battle has already ended",
    });
  }

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "") {
    return res.status(400).json({
      message: "Unknown monster",
    });
  }

  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);
  const prefixLog = `/boss/end: ${resurrectionPrompt}:`;

  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  let errorCnt = 0;
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await bossBattle.endBossBattle(eventKey!, bbeId, resurrectionPrompt);
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

  return res.status(200).json({ message: "OK" });
}
