// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { NOT_FOUND_SKILL } from "@/const/monster";
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
  calcBossDamage,
  calcHealing,
  calcLifePoint,
  calcMonsterDamage,
  debuffMonster,
  decideAction as decideBossAction,
  decideDroppedItem,
  decideOtherSkillType,
  judgeBossSkillHit,
  judgeSkillHit,
} from "@/utils/bossBattleUtils";
import { getMonsterSkillsLimit4, isUnknownSkill } from "@/utils/monsterUtils";

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

  const skill = req.body.skill || "";
  if (skill === "")
    return res.status(400).json({
      message: "Unknown skill",
    });

  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);
  const prefixLog = `/boss/use-skill: ${resurrectionPrompt}:`;

  // TODO: dev用
  const devBBkParam = req.body.devBBkParam;
  console.log(prefixLog, "devBBkParam = ", devBBkParam);

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
  console.log(prefixLog, "bbState = ", bbState);
  console.log(prefixLog, "monsterExtension = ", monsterExtension);
  console.log(prefixLog, "boss = ", boss);

  const usedItemId = EnumItem.none;

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

  // スキルチェック
  const skillsLimit4 = getMonsterSkillsLimit4(monsterExtension.skills);
  const skillIndex = skillsLimit4.indexOf(skill);
  if (skillIndex === NOT_FOUND_SKILL)
    return res.status(400).json({
      message: "Not found skill",
    });
  const usedSkillType = monsterExtension.skillTypes[skillIndex];
  if (isUnknownSkill(usedSkillType))
    return res.status(400).json({
      message: "Unknown skillType",
    });

  // ボス行動確定
  const bossAction = decideBossAction(bbState.bossSign);
  console.log(prefixLog, "bossAction = ", bossAction);

  // Otherスキル行動確定
  let otherSkillAction = EnumOtherSkillAction.none;
  if (usedSkillType === EnumSkillType.other)
    otherSkillAction = decideOtherSkillType(
      monsterExtension.atk,
      monsterExtension.inte,
    );
  console.log(prefixLog, "otherSkillAction = ", otherSkillAction);

  // 命中判定
  const monsterHit = judgeSkillHit(usedSkillType);
  const bossHit = judgeBossSkillHit(
    bossAction,
    usedSkillType,
    otherSkillAction,
    monsterHit,
    false,
    false,
  );
  console.log(prefixLog, "monsterHit = ", monsterHit);
  console.log(prefixLog, "bossHit = ", bossHit);

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
    false,
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

  // バフ・デバフ計算
  let newMonsterAdj = bbState.monsterAdj;
  if (bossAction === EnumBossAction.debuff && bossHit)
    newMonsterAdj = debuffMonster(newMonsterAdj, devBBkParam);
  let newBossAdj = bbState.bossAdj;
  if (bossAction === EnumBossAction.buff && bossHit)
    newBossAdj = buffBoss(newBossAdj, devBBkParam);
  console.log(prefixLog, "newMonsterAdj = ", newMonsterAdj);
  console.log(prefixLog, "newBossAdj = ", newBossAdj);

  // アイテムドロップ判定
  let newHasBuffItem = bbState.hasBuffItem;
  let newHasDebuffItem = bbState.hasDebuffItem;
  let newHasHealItem = bbState.hasHealItem;
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

  let errorCnt = 0;
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
  });
}
