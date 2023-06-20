// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { BBkParamModel } from "@/models/BBkParamModel";
import { EventKey } from "@/types/EventKey";
import {
  getBossSign,
  getInitialBBState,
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
  const prefixLog = `/boss/start: ${resurrectionPrompt}:`;

  // TODO: 後で消す
  const bbKParam =
    process.env.STAGE === "develop"
      ? req.body.bbKParam
      : BBkParamModel.create({});

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  let results: any;
  try {
    results = await Promise.all([
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      bossBattle.getMonsterAdj(eventKey!, bbeId, resurrectionPrompt),
      bossBattle.getBBState(eventKey!, bbeId, resurrectionPrompt),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }

  const monsterExtension = results[0][0];
  const monsterAdj = results[1];
  const bbState = results[2];

  // スキルタイプチェック
  if (hasUnknownSkill(monsterExtension.skillTypes))
    return res.status(400).json({
      message: "This monster has unknown skill",
    });

  // 補正値チェック
  if (isInvalidMonsterAdj(monsterAdj))
    return res.status(400).json({
      message: "This monster has no monsterAdj",
    });

  // 戦闘開始済みチェック
  if (bbState.bossBattleStarted)
    return res.status(400).json({
      message: "Boss battle has already started",
    });

  // モンスター補正値計算
  const initialMonsterAdj = initMonsterAdj(monsterAdj);
  // TODO: 後で消す
  // const initialMonsterAdj = Math.floor(
  //   Number(bbKParam.kMonsterWeakness) * 100,
  // );

  // ボス前兆確定
  let bossSign = 0;
  while (true) {
    bossSign = getBossSign();
    if (bossSign >= 10) break;
  }

  // ボスバトル開始
  let errorCnt = 0;
  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await bossBattle.startBossBattle(
        eventKey!,
        bbeId,
        resurrectionPrompt,
        initialMonsterAdj,
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

  // BBState取得
  const newBBState = getInitialBBState(initialMonsterAdj, bossSign);
  console.log(prefixLog, "newBBState: ", newBBState);

  return res.status(200).json({ newBBState });
}
