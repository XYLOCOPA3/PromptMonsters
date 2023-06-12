// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { EventKey } from "@/types/EventKey";
import {
  getBossSign,
  getInitialBBState,
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

  // TODO: dev用
  const devBBkParam = req.body.devBBkParam;
  console.log("devBBkParam: ", devBBkParam);

  try {
    const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
    const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);
    const results = await Promise.all([
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      bossBattle.getMonsterAdj(eventKey!, bbeId, resurrectionPrompt),
      bossBattle.getBBState(eventKey!, bbeId, resurrectionPrompt),
    ]);
    const monsterExtension = results[0][0];
    const monsterAdj = results[1];
    const bbState = results[2];
    console.log("monsterExtension: ", monsterExtension);
    console.log("monsterAdj: ", monsterAdj);
    console.log("bbState: ", bbState);

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
    // const calculatedMonsterAdj = initMonsterAdj(monsterAdj);
    // TODO: dev用
    const calculatedMonsterAdj = Math.floor(devBBkParam.kMonsterWeakness * 100);
    console.log("calculatedMonsterAdj: ", calculatedMonsterAdj);

    // ボス前兆確定
    let bossSign = 0;
    while (true) {
      bossSign = getBossSign();
      if (bossSign >= 10) break;
    }
    console.log("bossSign: ", bossSign);

    // ボスバトル開始
    await bossBattle.startBossBattle(
      eventKey!,
      bbeId,
      resurrectionPrompt,
      calculatedMonsterAdj,
      bossSign,
    );

    // BBState取得
    const newBBState = getInitialBBState(calculatedMonsterAdj, bossSign);
    console.log("newBBState: ", newBBState);

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
