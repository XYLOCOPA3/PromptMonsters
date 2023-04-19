import { MonsterModel } from "@/models/MonsterModel";
import { IPromptMonsters } from "types/ethers-contracts/PromptMonsters";

export class BasePromptMonstersContract {
  constructor() {}

  /**
   * Get monster struct
   * @param data monster struct output
   * @return {MonsterModel} MonsterModel
   */
  toMonsterStruct = (data: MonsterModel): IPromptMonsters.MonsterStruct => {
    const monster: IPromptMonsters.MonsterStruct = {
      name: data.name,
      flavor: data.flavor,
      skills: data.skills,
      lv: data.lv,
      hp: data.status.HP,
      atk: data.status.ATK,
      def: data.status.DEF,
      inte: data.status.INT,
      mgr: data.status.MGR,
      agl: data.status.AGL,
      maxSkills: data.maxSkills,
      maxSkillsSet: data.maxSkillsSet,
    };
    return monster;
  };
}
