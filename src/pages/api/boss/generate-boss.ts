// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BOSS_IMAGE_URL_NORMAL, BOSS_IMAGE_URL_RARE } from "@/const/bossBattle";
import { RPC_URL } from "@/const/chainParams";
import { ERROR_WAIT_TIME, MAX_ERROR_CNT } from "@/const/error";
import { LANGUAGES } from "@/const/language";
import { MAX_SKILLS } from "@/const/monster";
import { ServerBossBattle } from "@/features/boss/api/contracts/ServerBossBattle";
import { IPromptMonstersExtension } from "@/typechain/PromptMonstersExtension";
import { EventKey } from "@/types/EventKey";
import { StatusContract } from "@/types/StatusContract";
import { isRareStatusContract } from "@/utils/bossBattleUtils";
import { ethers } from "ethers";

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
  if (now <= endTime) {
    return res.status(400).json({
      message: "Boss battle has not ended yet",
    });
  }

  const language = req.body.language || "";
  if (!LANGUAGES.includes(language))
    return res.status(400).json({ message: "Invalid language." });

  const userId = req.body.userId || "";
  if (userId === "")
    return res.status(400).json({ message: "Invalid user ID." });

  let errorCnt = 0;
  const eventKey = process.env.EVENT_KEY as EventKey;
  const bbeId = Number(process.env.BBE_ID);
  const bossBattle = ServerBossBattle.instance(RPC_URL.mchVerse);

  let bossExtension: any;
  try {
    const results = await Promise.all([
      bossBattle.getMintable(eventKey, bbeId, userId),
      bossBattle.getBossExtension(eventKey, bbeId, language),
    ]);
    const mintable = results[0];
    bossExtension = results[1];
    if (!mintable) return res.status(400).json({ message: "You cannot mint." });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(400).json({ message: error });
  }

  const resurrectionPrompt = ethers.Wallet.createRandom().address;
  console.log("Create Monster Resurrection Prompt: ", resurrectionPrompt);
  const prefixLog = `/generate-monster: ${resurrectionPrompt}:`;

  const [monsterExtension, imageURL] = _getMonster(
    bossExtension,
    resurrectionPrompt,
  );
  console.log(prefixLog, "monsterExtension:", monsterExtension);
  console.log(prefixLog, "imageURL:", imageURL);

  while (true) {
    try {
      console.log(prefixLog, "errorCnt:", errorCnt);
      await bossBattle.mintBoss(
        eventKey,
        bbeId,
        userId,
        monsterExtension,
        imageURL,
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

  return res.status(200).json({ monsterExtension, imageURL });
}

/**
 * Get monster
 * @param bossExtension content
 * @param resurrectionPrompt language
 * @return {any} monster
 */
const _getMonster = (
  bossExtension: IPromptMonstersExtension.MonsterExtensionStructOutput,
  resurrectionPrompt: string,
): any => {
  const status = _getStatus();
  let imageURL = BOSS_IMAGE_URL_NORMAL;
  let [skills, skillTypes] = _getSkills(
    bossExtension.skills,
    bossExtension.skillTypes,
  );
  if (isRareStatusContract(status)) {
    imageURL = BOSS_IMAGE_URL_RARE;
    skills = [
      bossExtension.skills[4], // 特殊攻撃
      bossExtension.skills[74], // 回復
      bossExtension.skills[46], // その他(バフ)
      bossExtension.skills[57], // その他(デバフ)
    ];
    skillTypes = [
      bossExtension.skillTypes[4],
      bossExtension.skillTypes[74],
      bossExtension.skillTypes[46],
      bossExtension.skillTypes[57],
    ];
  }
  const monster = {
    feature: bossExtension.feature,
    name: bossExtension.name,
    flavor: bossExtension.flavor,
    skills: skills,
    lv: bossExtension.lv,
    hp: status.hp,
    atk: status.atk,
    def: status.def,
    inte: status.inte,
    mgr: status.mgr,
    agl: status.agl,
    skillTypes: skillTypes,
    resurrectionPrompt: resurrectionPrompt,
  };
  return [monster, imageURL];
};

/**
 * Get status
 * @return {any} monster
 */
const _getStatus = (): StatusContract => {
  // TODO: ボスごとに切り替えられるようにする
  /*
   * ヨシュカ
   * Status   MIN   MAX   AVERAGE
   * ------------------------------
   * hp       20    40    30
   * atk      10    15    12.5
   * def      15    20    17.5
   * inte     15    20    17.5
   * mgr      5     15    10
   * agl      5     15    10
   * ------------------------------
   * sum      70    125   97.5
   */
  return {
    hp: Math.floor(Math.random() * 21) + 20,
    atk: Math.floor(Math.random() * 6) + 10,
    def: Math.floor(Math.random() * 6) + 15,
    inte: Math.floor(Math.random() * 6) + 15,
    mgr: Math.floor(Math.random() * 11) + 5,
    agl: Math.floor(Math.random() * 11) + 5,
  };
};

/**
 * Get status
 * @return {any} monster
 */
const _getSkills = (
  skills: string[],
  skillTypes: number[],
): [string[], number[]] => {
  // TODO: ボスごとに切り替えられるようにする
  const selectedSkills: string[] = [];
  const selectedSkillTypes: number[] = [];

  while (true) {
    const random = Math.floor(Math.random() * skills.length);
    if (selectedSkills.includes(skills[random])) continue;
    selectedSkills.push(skills[random]);
    selectedSkillTypes.push(skillTypes[random]);
    if (selectedSkills.length >= MAX_SKILLS) break;
  }

  return [selectedSkills, selectedSkillTypes];
};
