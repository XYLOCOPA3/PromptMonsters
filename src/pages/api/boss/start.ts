// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { RPC_URL } from "@/lib/wallet";
import { EventKey } from "@/types/EventKey";
import {
  getBossSign,
  initMonsterAdj,
  isInvalidMonsterAdj,
} from "@/utils/bossBattleUtils";
import { hasUnknownSkill } from "@/utils/monsterUtils";

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
    const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
    const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);
    const results = await Promise.all([
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      bossBattle.getMonsterAdj(eventKey!, bbeId, resurrectionPrompt),
      bossBattle.getBBState(eventKey!, bbeId, resurrectionPrompt),
    ]);

    // スキルタイプチェック
    const monsterExtension = results[0][0];
    if (hasUnknownSkill(monsterExtension.skillTypes))
      return res.status(400).json({
        message: "This monster has unknown skill",
      });

    // 補正値チェック
    const monsterAdj = results[1];
    if (isInvalidMonsterAdj(monsterAdj))
      return res.status(400).json({
        message: "This monster has no monsterAdj",
      });

    // BBStateチェック
    const bbState = results[2];
    if (bbState.bossBattleStarted)
      return res.status(400).json({
        message: "Boss battle has already started",
      });

    // スタート処理
    const calculatedMonsterAdj = initMonsterAdj(monsterAdj);
    const bossSign = getBossSign();
    await bossBattle.startBossBattle(
      eventKey!,
      bbeId,
      resurrectionPrompt,
      calculatedMonsterAdj,
      bossSign,
    );

    const newBBState = await bossBattle.getBBState(
      eventKey!,
      bbeId,
      resurrectionPrompt,
    );
    return res.status(200).json({ newBBState });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
