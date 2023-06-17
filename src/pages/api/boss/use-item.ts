// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { DevBBkParamModel } from "@/dev/models/DevBBkParamModel";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { BBState } from "@/types/BBState";
import { EnumBossAction } from "@/types/EnumBossAction";
import { EnumItem } from "@/types/EnumItem";
import { EnumOtherSkillAction } from "@/types/EnumOtherSkillAction";
import { EnumSkillType } from "@/types/EnumSkillType";
import { EventKey } from "@/types/EventKey";
import {
  buffBoss,
  buffMonster,
  calcBossDamage,
  calcHealing,
  calcLifePoint,
  calcMonsterDamage,
  debuffBoss,
  debuffMonster,
  decideBossAction,
  decideDroppedItem,
  hasItem,
  judgeBossSkillHit,
} from "@/utils/bossBattleUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(400).json({
      message: "Only POST",
    });

  let errorCnt = 0;

  const resurrectionPrompt = req.body.resurrectionPrompt || "";
  if (resurrectionPrompt === "")
    return res.status(400).json({
      message: "Unknown monster",
    });

  const usedItemId =
    req.body.usedItemId === 0 ? req.body.usedItemId : req.body.usedItemId || "";
  if (usedItemId === "")
    return res.status(400).json({
      message: "Unknown item",
    });

  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);
  const prefixLog = `/boss/use-item: ${resurrectionPrompt}:`;

  // TODO: 後で消す
  const devBBkParam =
    process.env.STAGE === "develop"
      ? req.body.devBBkParam
      : DevBBkParamModel.create({});

  const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  let results: any;
  try {
    results = await Promise.all([
      bossBattle.getBBState(eventKey!, bbeId, resurrectionPrompt),
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      bossBattle.getBossExtension(eventKey!, bbeId, "English"),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(prefixLog, error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(prefixLog, error);
    return res.status(400).json({ message: error });
  }

  const bbState = results[0];
  const monsterExtension = results[1][0];
  const boss = results[2];

  const defensed = false;
  const itemUsed = true;
  let newMonsterAdj = bbState.monsterAdj;
  let newBossAdj = bbState.bossAdj;

  // 戦闘開始チェック
  if (!bbState.bossBattleStarted)
    return res.status(400).json({
      message: "Boss battle has not started",
    });

  // 戦闘継続チェック
  if (!bbState.bossBattleContinued)
    return res.status(400).json({
      message: "Boss battle has not continued",
    });

  // モンスターHPチェック
  if (bbState.lp <= 0)
    return res.status(400).json({
      message: "Monster has already been defeated",
    });

  // アイテム所持チェック
  if (!hasItem(usedItemId, bbState))
    return res.status(400).json({
      message: "You have no this item",
    });

  // 脱出チェック
  if (usedItemId === EnumItem.escape) {
    // BBState更新
    const newBBState: BBState = {
      bossBattleStarted: bbState.bossBattleStarted,
      bossBattleContinued: false,
      lp: bbState.lp,
      turn: bbState.turn,
      score: bbState.score,
      monsterAdj: bbState.monsterAdj,
      bossAdj: bbState.bossAdj,
      bossSign: bbState.bossSign,
      hasHealItem: bbState.hasHealItem,
      hasBuffItem: bbState.hasBuffItem,
      hasDebuffItem: bbState.hasDebuffItem,
      hasEscapeItem: false,
    };
    console.log(prefixLog, "newBBState = ", newBBState);
    while (true) {
      try {
        await bossBattle.updateBossBattleResult(
          eventKey,
          bbeId,
          resurrectionPrompt,
          newBBState,
        );
        break;
      } catch (error) {
        errorCnt++;
        console.error(prefixLog, errorCnt);
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
      bossAction: EnumBossAction.none,
      otherSkillAction: EnumOtherSkillAction.none,
      monsterHit: true,
      bossHit: false,
      healing: 0,
      monsterDamage: 0,
      bossDamage: 0,
      bossSign: bbState.bossSign,
      usedSkillType: EnumSkillType.none,
      droppedItemId: EnumItem.none,
    });
  }

  // スキルチェック
  const usedSkillType = EnumSkillType.none;
  console.log(prefixLog, "usedSkillType = ", usedSkillType);

  // ボス行動確定
  const bossAction = decideBossAction(bbState.bossSign);
  console.log(prefixLog, "bossAction = ", bossAction);

  // Otherスキル行動確定
  const otherSkillAction = EnumOtherSkillAction.none;
  console.log(prefixLog, "otherSkillAction = ", otherSkillAction);

  // 命中判定
  const monsterHit = true;
  const bossHit = judgeBossSkillHit(
    bossAction,
    usedSkillType,
    otherSkillAction,
    monsterHit,
    defensed,
    itemUsed,
  );
  console.log(prefixLog, "monsterHit = ", monsterHit);
  console.log(prefixLog, "bossHit = ", bossHit);

  // バフ・デバフ計算（アイテム）
  if (usedItemId === EnumItem.buff)
    newMonsterAdj = buffMonster(newMonsterAdj, devBBkParam);
  if (usedItemId === EnumItem.debuff)
    newBossAdj = debuffBoss(newMonsterAdj, devBBkParam);
  console.log(prefixLog, "newMonsterAdj = ", newMonsterAdj);
  console.log(prefixLog, "newBossAdj = ", newBossAdj);

  // ダメージ計算
  const bossDamage = calcBossDamage(
    monsterHit,
    usedSkillType,
    otherSkillAction,
    bossAction,
    monsterExtension.atk,
    monsterExtension.inte,
    boss.def,
    boss.mgr,
    bbState.monsterAdj,
    bbState.bossAdj,
    bbState.turn,
    devBBkParam,
  );
  console.log(prefixLog, "bossDamage = ", bossDamage);

  const monsterDamage = calcMonsterDamage(
    bossHit,
    boss.skillTypes[bossAction],
    otherSkillAction,
    bossAction,
    boss.atk,
    boss.inte,
    monsterExtension.def,
    monsterExtension.mgr,
    bbState.monsterAdj,
    bbState.bossAdj,
    bbState.turn,
    defensed,
    devBBkParam,
  );
  console.log(prefixLog, "monsterDamage = ", monsterDamage);

  // 回復計算
  const healing = calcHealing(
    usedSkillType,
    otherSkillAction,
    usedItemId,
    monsterExtension.inte,
    bbState.monsterAdj,
    devBBkParam,
  );
  console.log(prefixLog, "healing = ", healing);

  // lp計算
  const lp = calcLifePoint(bbState.lp, monsterDamage, healing);
  console.log(prefixLog, "lp = ", lp);

  // バフ・デバフ計算（ボス行動）
  if (bossAction === EnumBossAction.debuff && bossHit)
    newMonsterAdj = debuffMonster(newMonsterAdj, devBBkParam);
  if (bossAction === EnumBossAction.buff && bossHit)
    newBossAdj = buffBoss(newBossAdj, devBBkParam);
  console.log(prefixLog, "newMonsterAdj = ", newMonsterAdj);
  console.log(prefixLog, "newBossAdj = ", newBossAdj);

  // アイテムドロップ判定
  let newHasBuffItem =
    usedItemId === EnumItem.buff ? false : bbState.hasBuffItem;
  let newHasDebuffItem =
    usedItemId === EnumItem.debuff ? false : bbState.hasDebuffItem;
  let newHasHealItem =
    usedItemId === EnumItem.healing ? false : bbState.hasHealItem;
  let newHasEscapeItem = bbState.hasEscapeItem;
  const droppedItemId = decideDroppedItem(
    newHasBuffItem,
    newHasDebuffItem,
    newHasHealItem,
    newHasEscapeItem,
  );
  console.log(prefixLog, "droppedItemId = ", droppedItemId);
  if (droppedItemId === EnumItem.buff) newHasBuffItem = true;
  if (droppedItemId === EnumItem.debuff) newHasDebuffItem = true;
  if (droppedItemId === EnumItem.healing) newHasHealItem = true;
  if (droppedItemId === EnumItem.escape) newHasEscapeItem = true;

  // BBState更新
  const newBBState: BBState = {
    bossBattleStarted: bbState.bossBattleStarted,
    bossBattleContinued: false,
    lp: lp,
    turn: bbState.turn,
    score: bbState.score + bossDamage,
    monsterAdj: newMonsterAdj,
    bossAdj: newBossAdj,
    bossSign: bbState.bossSign,
    hasHealItem: newHasHealItem,
    hasBuffItem: newHasBuffItem,
    hasDebuffItem: newHasDebuffItem,
    hasEscapeItem: newHasEscapeItem,
  };
  console.log(prefixLog, "newBBState = ", newBBState);

  while (true) {
    try {
      console.log(prefixLog, errorCnt);
      await bossBattle.updateBossBattleResult(
        eventKey,
        bbeId,
        resurrectionPrompt,
        newBBState,
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
    bossAction,
    otherSkillAction,
    monsterHit,
    bossHit,
    healing,
    monsterDamage,
    bossDamage,
    bossSign: newBBState.bossSign,
    usedSkillType,
    droppedItemId,
    newMonsterAdj,
    newBossAdj,
  });
}
