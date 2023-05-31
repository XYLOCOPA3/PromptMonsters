import { SKILL_TYPE_MAP } from "@/const/monster";
import { EnumSkillType } from "@/types/EnumSkillType";
import { SkillType } from "@/types/SkillType";

export const hasUnknownSkill = (skillTypes: number[]): boolean => {
  for (let i = 0; i < skillTypes.length; i++) {
    if (skillTypes[i] === EnumSkillType.other) continue;
    if (skillTypes[i] === EnumSkillType.physicalAttack) continue;
    if (skillTypes[i] === EnumSkillType.specialAttack) continue;
    if (skillTypes[i] === EnumSkillType.healing) continue;
    return true;
  }
  return false;
};

export const getSkillTypesFromStr = (skillTypesStr: SkillType[]): number[] => {
  const skillTypes: number[] = [];
  for (let i = 0; i < skillTypesStr.length; i++) {
    skillTypes.push(SKILL_TYPE_MAP[skillTypesStr[i]]);
  }
  return skillTypes;
};

export const getMonsterSkillsLimit4 = (skills: string[]): string[] => {
  const skillsLimit4: string[] = [];
  for (let i = 0; i < skills.length; i++) {
    skillsLimit4.push(skills[i]);
    if (i === 3) break;
  }
  return skillsLimit4;
};
