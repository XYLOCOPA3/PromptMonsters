import { EnumSkillType } from "@/types/EnumSkillType";

export const MAX_STAMINA = 3;
export const UNMINTED_MONSTER_ID = "";
export const MAX_SKILLS = 4;
export const SKILL_TYPE_MAP = {
  Unknown: EnumSkillType.none,
  Other: EnumSkillType.other,
  "Physical Attack": EnumSkillType.physicalAttack,
  "Special Attack": EnumSkillType.specialAttack,
  Healing: EnumSkillType.healing,
};

export const SKILL_TYPE_NAME = {
  日本語: new Map([
    [EnumSkillType.other, "???"],
    [EnumSkillType.physicalAttack, "物理攻撃"],
    [EnumSkillType.specialAttack, "特殊攻撃"],
    [EnumSkillType.healing, "回復"],
  ]),
  English: new Map([
    [EnumSkillType.other, "???"],
    [EnumSkillType.physicalAttack, "Physical Attack"],
    [EnumSkillType.specialAttack, "Special Attack"],
    [EnumSkillType.healing, "Healing"],
  ]),
};
