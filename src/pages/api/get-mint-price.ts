// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { RPC_URL } from "@/lib/wallet";
import { ethers } from "ethers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({ message: "Only POST" });
  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  try {
    res.status(200).json({
      mintPrice: Number(
        ethers.utils.formatEther(
          (await promptMonsters.getMintPrice()).toString(),
        ),
      ),
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
