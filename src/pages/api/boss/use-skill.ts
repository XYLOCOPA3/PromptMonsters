// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { NOT_FOUND_SKILL } from "@/const/monster";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { ServerPromptMonsters } from "@/features/monster/api/contracts/ServerPromptMonsters";
import { RPC_URL } from "@/lib/wallet";
import { BBState } from "@/types/BBState";
import { EnumBossAction } from "@/types/EnumBossAction";
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

  try {
    const promptMonsters = ServerPromptMonsters.instance(RPC_URL.mchVerse);
    const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);
    const results = await Promise.all([
      bossBattle.getBBState(eventKey!, bbeId, resurrectionPrompt),
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      bossBattle.getBossExtension(eventKey!, bbeId, "English"),
    ]);
    const bbState = results[0];
    const monsterExtension = results[1][0];
    const boss = results[2];
    console.log("bbState: ", bbState);
    console.log("monsterExtension: ", monsterExtension);
    console.log("boss: ", boss);

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
    console.log("bossAction: ", bossAction);

    // Otherスキル行動確定
    let otherSkillAction = EnumOtherSkillAction.none;
    if (usedSkillType === EnumSkillType.other)
      otherSkillAction = decideOtherSkillType(
        monsterExtension.atk,
        monsterExtension.inte,
      );
    console.log("otherSkillAction: ", otherSkillAction);

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
    console.log("monsterHit: ", monsterHit);
    console.log("bossHit: ", bossHit);

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
    );
    console.log("bossDamage: ", bossDamage);

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
    );
    console.log("monsterDamage: ", monsterDamage);

    // 回復計算
    const healing = calcHealing(
      usedSkillType,
      otherSkillAction,
      monsterExtension.inte,
      bbState.monsterAdj,
    );
    console.log("healing: ", healing);

    // lp計算
    const lp = calcLifePoint(bbState.lp, monsterDamage, healing);
    console.log("lp: ", lp);

    // バフ・デバフ計算
    let newMonsterAdj = bbState.monsterAdj;
    if (bossAction === EnumBossAction.debuff && bossHit)
      newMonsterAdj = debuffMonster(newMonsterAdj);
    let newBossAdj = bbState.bossAdj;
    if (bossAction === EnumBossAction.buff && bossHit)
      newBossAdj = buffBoss(newBossAdj);
    console.log("newMonsterAdj: ", newMonsterAdj);
    console.log("newBossAdj: ", newBossAdj);

    // BBState更新
    const newBbState: BBState = {
      bossBattleStarted: bbState.bossBattleStarted,
      bossBattleContinued: bbState.bossBattleContinued,
      lp: lp,
      turn: bbState.turn,
      score: bbState.score + bossDamage,
      monsterAdj: newMonsterAdj,
      bossAdj: newBossAdj,
      bossSign: bbState.bossSign,
      hasHealItem: bbState.hasHealItem,
      hasBuffItem: bbState.hasBuffItem,
      hasDebuffItem: bbState.hasDebuffItem,
      hasEscapeItem: bbState.hasEscapeItem,
    };
    await bossBattle.updateBossBattleResult(
      eventKey,
      bbeId,
      resurrectionPrompt,
      newBbState,
    );
    console.log("newBbState: ", newBbState);

    return res.status(200).json({
      newBbState,
      bossAction,
      otherSkillAction,
      monsterHit,
      bossHit,
      healing,
      monsterDamage,
      bossDamage,
      bossSign: newBbState.bossSign,
      usedSkillType,
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
