// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
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

  const endTime = new Date(Number(process.env.BOSS_BATTLE_END_TIME));
  const now = new Date();
  if (now > endTime) {
    return res.status(400).json({
      message: "Boss battle has already ended",
    });
  }

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "")
    return res.status(400).json({
      message: "Unknown monster",
    });

  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);
  const prefixLog = `/boss/continue: ${resurrectionPrompt}:`;

  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  let bbState: any;
  try {
    bbState = await bossBattle.getBBState(eventKey!, bbeId, resurrectionPrompt);
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }

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
  console.log(prefixLog, "newBBState = ", newBBState);

  // 戦闘継続
  let errorCnt = 0;
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await bossBattle.continueBossBattle(
        eventKey,
        bbeId,
        resurrectionPrompt,
        bossSign,
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

  return res.status(200).json({
    newBBState,
  });
}
