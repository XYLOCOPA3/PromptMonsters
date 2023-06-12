// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
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
    await bossBattle.endBossBattle(eventKey!, bbeId, resurrectionPrompt);
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
