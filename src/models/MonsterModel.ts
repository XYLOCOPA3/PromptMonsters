import { BaseModel } from "@/models/BaseModel";
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
   * @param feature monster feature
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
    public readonly feature: string = "",
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
   * fromJson
   * @param feature monster feature
   * @param json json
   * @param lv level
   * @return {MonsterModel} MonsterModel
   */
  public static fromData(
    feature: string,
    json: any,
    lv: number = 1,
  ): MonsterModel {
    return MonsterModel.create({
      name: json.name,
      flavor: json.flavor,
      skills: json.skills,
      lv: lv,
      status: json.status,
      feature: feature,
    });
  }
}
