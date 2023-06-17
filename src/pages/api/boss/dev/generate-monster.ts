// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { ethers } from "ethers";

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

  let errorCnt = 0;

  const feature = "平均";

  const resurrectionPrompt = ethers.Wallet.createRandom().address;
  console.log("Create Monster Resurrection Prompt: ", resurrectionPrompt);

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  const monster = _getDevMonster(feature);
  console.log(monster);

  while (true) {
    try {
      console.log(errorCnt);
      await promptMonsters.generateMonster(
        resurrectionPrompt,
        monster,
        feature,
      );
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

  return res.status(200).json({ monster, resurrectionPrompt, feature });
}

/**
 * Get monster
 * @return {any} monster
 */
const _getDevMonster = (feature: string): any => {
  return {
    feature: feature,
    name: "アベモン",
    flavor: "平均的なモンスター。普通の振る舞いをするのが得意。",
    skills: [
      "平均的な物理攻撃",
      "平均的な特殊攻撃",
      "平均的な回復",
      "平均的な???",
    ],
    lv: 1,
    status: {
      HP: 20,
      ATK: 10,
      DEF: 10,
      INT: 10, // INT
      MGR: 10,
      AGL: 10,
    },
  };
};
