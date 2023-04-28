// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptMonstersContract } from "@/features/monster/api/contracts/PromptMonstersContract";
import { RPC_URL } from "@/lib/wallet";
import { ethers } from "ethers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const promptMonsters = PromptMonstersContract.instance(
    RPC_URL.mchVerseTestnet,
  );
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
