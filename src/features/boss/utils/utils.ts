import { BOSS_NEXT_ACTION_SIGNS } from "@/const/bossBattle";

export const getBossAppearedMsg = (
  bossName: string,
  bossAppearedMsg: string,
): string => {
  return bossAppearedMsg.replace("bossName", bossName);
};

export const getMonsterUsedSkillMsg = (
  monsterName: string,
  skillName: string,
  monsterUsedSkillMsg: string,
): string => {
  return monsterUsedSkillMsg
    .replace("monsterName", monsterName)
    .replace("skillName", skillName);
};

export const getMonsterDamagedMsg = (
  monsterName: string,
  monsterDamaged: number,
  bossName: string,
  monsterDamagedMsg: string,
): string => {
  return monsterDamagedMsg
    .replace("monsterName", monsterName)
    .replace("monsterDamaged", monsterDamaged.toString())
    .replace("bossName", bossName);
};

export const getBossUsedSkillMsg = (
  bossName: string,
  bossSkillName: string,
  bossUsedSkillMsg: string,
): string => {
  return bossUsedSkillMsg
    .replace("bossName", bossName)
    .replace("bossSkillName", bossSkillName);
};

export const getBossDamagedMsg = (
  bossName: string,
  bossDamaged: number,
  monsterName: string,
  bossDamagedMsg: string,
): string => {
  return bossDamagedMsg
    .replace("bossName", bossName)
    .replace("bossDamaged", bossDamaged.toString())
    .replace("monsterName", monsterName);
};

export const getDroppedItemMsg = (
  bossName: string,
  itemName: string,
  droppedItemMsg: string,
): string => {
  return droppedItemMsg
    .replace("bossName", bossName)
    .replace("itemName", itemName);
};

export const getBossNextActionSignMsg = (
  bossNextActionSignIndex: number,
  language: "日本語" | "English",
  bossName: string,
): string => {
  return BOSS_NEXT_ACTION_SIGNS["mch"][language][
    bossNextActionSignIndex
  ].replace("bossName", bossName);
};

export const getUsedItemMsg = (
  monsterName: string,
  itemName: string,
  usedItemMsg: string,
): string => {
  return usedItemMsg
    .replace("monsterName", monsterName)
    .replace("itemName", itemName);
};

export const getItemUseResultMsg = (
  monsterName: string,
  bossName: string,
  itemUseResultMsg: string,
): string => {
  return itemUseResultMsg
    .replace("monsterName", monsterName)
    .replace("bossName", bossName);
};

export const getDefensedMsg = (
  monsterName: string,
  defensedMsg: string,
): string => {
  return defensedMsg.replace("monsterName", monsterName);
};
