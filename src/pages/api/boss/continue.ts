// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { RPC_URL } from "@/lib/wallet";
import { BBState } from "@/types/BBState";
import { EventKey } from "@/types/EventKey";
import { getBossSign } from "@/utils/bossBattleUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({
      message: "Only POST",
    });

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "")
    return res.status(400).json({
      message: "Unknown monster",
    });

  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);

  try {
    const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);
    const bbState = await bossBattle.getBBState(
      eventKey!,
      bbeId,
      resurrectionPrompt,
    );
    console.log("bbState: ", bbState);

    // 戦闘開始チェック
    if (!bbState.bossBattleStarted)
      return res.status(400).json({
        message: "Boss battle has not started",
      });

    // 戦闘継続チェック
    if (bbState.bossBattleContinued)
      return res.status(400).json({
        message: "Boss battle has already continued",
      });

    // モンスターHPチェック
    if (bbState.lp <= 0)
      return res.status(400).json({
        message: "Monster has already been defeated",
      });

    // ボス前兆確定
    const bossSign = getBossSign();
    console.log("bossSign: ", bossSign);

    // 戦闘継続
    await bossBattle.continueBossBattle(
      eventKey,
      bbeId,
      resurrectionPrompt,
      bossSign,
    );

    // BBState更新
    const newBBState: BBState = {
      bossBattleStarted: bbState.bossBattleStarted,
      bossBattleContinued: true,
      lp: bbState.lp,
      turn: bbState.turn + 1,
      score: bbState.score,
      monsterAdj: bbState.monsterAdj,
      bossAdj: bbState.bossAdj,
      bossSign: bossSign,
      hasHealItem: bbState.hasHealItem,
      hasBuffItem: bbState.hasBuffItem,
      hasDebuffItem: bbState.hasDebuffItem,
      hasEscapeItem: bbState.hasEscapeItem,
    };
    console.log("newBBState: ", newBBState);

    return res.status(200).json({
      newBBState,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(400).json({ message: error });
  }
}
