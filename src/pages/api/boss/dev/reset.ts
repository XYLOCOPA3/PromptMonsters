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

  const stage = process.env.STAGE || "";
  if (stage !== "develop") {
    return res.status(400).json({
      message: "Develop only",
    });
  }

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "") {
    return res.status(400).json({
      message: "Unknown monster",
    });
  }

  let errorCnt = 0;

  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);

  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  while (true) {
    try {
      console.log(errorCnt);
      await bossBattle.deleteBBState(eventKey!, bbeId, resurrectionPrompt);
      errorCnt = 0;
      break;
    } catch (error) {
      errorCnt++;
      error instanceof Error
        ? console.error(error.message)
        : console.log(error);
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
