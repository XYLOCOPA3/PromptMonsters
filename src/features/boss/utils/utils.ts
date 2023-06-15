export const getBossAppearedMsg = (
  bossName: string,
  bossAppearedMsg: string,
): string => {
  return bossAppearedMsg.replace("bossName", bossName);
};

export const getHavingWeakFeatureMsg = (
  monsterName: string,
  bossName: string,
  weakFeature: string,
  msg: string,
): string => {
  return msg
    .replace("monsterName", monsterName)
    .replace("monsterName", monsterName)
    .replace("bossName", bossName)
    .replace("weakFeature", weakFeature);
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

export const getMonsterOtherHealMsg = (
  monsterName: string,
  msg: string,
): string => {
  return msg.replace("monsterName", monsterName);
};

export const getMonsterOtherPhysicalAttack = (
  monsterName: string,
  bossName: string,
  msg: string,
): string => {
  return msg.replace("monsterName", monsterName).replace("bossName", bossName);
};

export const getMonsterOtherPowerPhysicalAttack = (
  monsterName: string,
  msg: string,
): string => {
  return msg.replace("monsterName", monsterName);
};

export const getBossDamageMsg = (
  monsterName: string,
  bossDamage: number,
  bossName: string,
  msg: string,
): string => {
  return msg
    .replace("monsterName", monsterName)
    .replace("bossDamage", bossDamage.toString())
    .replace("bossName", bossName);
};

export const getMonsterHealMsg = (
  monsterName: string,
  healing: number,
  msg: string,
): string => {
  return msg
    .replace("monsterName", monsterName)
    .replace("healing", healing.toString());
};

export const getBossUsedSkillMsg = (
  bossName: string,
  bossSkillName: string,
  msg: string,
): string => {
  return msg
    .replace("bossName", bossName)
    .replace("bossSkillName", bossSkillName);
};

export const getBossPreCounterAttackMsg = (
  bossName: string,
  msg: string,
): string => {
  return msg.replace("bossName", bossName);
};

export const getBossDamagedMsg = (
  bossName: string,
  monsterDamage: number,
  monsterName: string,
  msg: string,
): string => {
  return msg
    .replace("bossName", bossName)
    .replace("monsterDamage", monsterDamage.toString())
    .replace("monsterName", monsterName);
};

export const getBossBuffMsg = (bossName: string, msg: string): string => {
  return msg.replace("bossName", bossName);
};

export const getBossDebuffMsg = (monsterName: string, msg: string): string => {
  return msg.replace("monsterName", monsterName);
};

export const getBuffDebuffBossMissMsg = (
  bossName: string,
  monsterName: string,
  bossBuffDebuffMissMsg: string,
): string => {
  return bossBuffDebuffMissMsg
    .replace("bossName", bossName)
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

export const getDefeatedMsg = (monsterName: string, msg: string): string => {
  return msg.replace("monsterName", monsterName);
};

export const getEscapeNextMsg = (bossName: string, msg: string): string => {
  return msg.replace("bossName", bossName);
};

export const getUsedBossSubActionMsg = (
  bossName: string,
  msg: string,
): string => {
  return msg.replace("bossName", bossName);
};

export const getBossSignMsg = (
  bossName: string,
  bossSignMsg: string,
  msg: string,
): string => {
  return msg.replace("bossName", bossName).replace("bossSignMsg", bossSignMsg);
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

export const getBossDefensedMsg = (bossName: string, msg: string): string => {
  return msg.replace("bossName", bossName);
};
