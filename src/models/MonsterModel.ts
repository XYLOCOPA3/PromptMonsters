import { BaseModel } from "@/models/BaseModel";
import { IPromptMonsters } from "@/typechain/PromptMonsters";
import { MonsterId } from "@/types/MonsterId";
import { Status } from "@/types/Status";

export class MonsterModel extends BaseModel<MonsterId> {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = MonsterModel.create({ id: "dummyId" });
   * ```
   * @param name name
   * @param flavor flavor text
   * @param skills skills
   * @param lv level
   * @param status status
   * @param maxSkills max skills
   * @param maxSkillsSet max skills set
   * @param stamina stamina
   * @param resurrectionPrompt resurrection prompt
   */
  private constructor(
    public readonly name: string = "",
    public readonly flavor: string = "",
    public readonly skills: string[] = [],
    public readonly lv: number = 0,
    public readonly status: Status = {
      HP: 0,
      ATK: 0,
      DEF: 0,
      INT: 0,
      MGR: 0,
      AGL: 0,
    },
    public readonly maxSkills: number = 100,
    public readonly maxSkillsSet: number = 100,
    public readonly stamina: number = 0,
    public readonly resurrectionPrompt: string = "",
  ) {
    super("");
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {MonsterModel} MonsterModel
   */
  public static create(modifyObject: {
    [P in keyof MonsterModel]?: MonsterModel[P];
  }): MonsterModel {
    return new MonsterModel().copyWith(modifyObject);
  }

  /**
   * fromContract
   * @param monsterId monster id
   * @param monsterStruct monster struct
   * @return {MonsterModel} MonsterModel
   */
  public static fromContract(
    monsterId: string,
    monsterStruct: IPromptMonsters.MonsterStructOutput,
    stamina: number,
  ): MonsterModel {
    return MonsterModel.create({
      id: monsterId,
      name: monsterStruct.name,
      flavor: monsterStruct.flavor,
      skills: monsterStruct.skills,
      lv: Number(monsterStruct.lv),
      status: {
        HP: Number(monsterStruct.hp),
        ATK: Number(monsterStruct.atk),
        DEF: Number(monsterStruct.def),
        INT: Number(monsterStruct.inte),
        MGR: Number(monsterStruct.mgr),
        AGL: Number(monsterStruct.agl),
      },
      stamina: stamina,
    });
  }

  /**
   * fromJson
   * @param json json
   * @param lv level
   * @return {MonsterModel} MonsterModel
   */
  public static fromData(
    json: any,
    stamina: number = 0,
    lv: number = 1,
  ): MonsterModel {
    return MonsterModel.create({
      name: json.name,
      flavor: json.flavor,
      skills: json.skills,
      lv: lv,
      status: json.status,
      stamina: stamina,
    });
  }

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
