import { SKILL_TYPE_MAP } from "@/const/monster";
import { EnumSkillType } from "@/types/EnumSkillType";
import { SkillType } from "@/types/SkillType";

export const hasUnknownSkill = (skillTypes: number[]): boolean => {
  for (let i = 0; i < skillTypes.length; i++) {
    if (!isUnknownSkill(skillTypes[i])) continue;
    return true;
  }
  return false;
};

export const isUnknownSkill = (skillType: number): boolean => {
  if (skillType === EnumSkillType.other) return false;
  if (skillType === EnumSkillType.physicalAttack) return false;
  if (skillType === EnumSkillType.specialAttack) return false;
  if (skillType === EnumSkillType.healing) return false;
  return true;
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
