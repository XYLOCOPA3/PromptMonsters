import { MonsterModel } from "@/models/MonsterModel";

export class BossModel extends MonsterModel {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = BossModel.create({ id: "dummyId" });
   * ```
   * @param strength strength
   * @param motions motions
   */
  private constructor(
    public readonly strength: number = 2,
    public readonly motions: string[] = [],
  ) {
    super("");
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {BossModel} BossModel
   */
  public static create(modifyObject: {
    [P in keyof BossModel]?: BossModel[P];
  }): BossModel {
    return new BossModel().copyWith(modifyObject);
  }

  // /**
  //  * fromContract
  //  * @param monsterId monster id
  //  * @param monsterStruct monster struct
  //  * @return {BossModel} BossModel
  //  */
  // public static fromContract(
  //   monsterId: string,
  //   monsterStruct: IPromptMonsters.MonsterStructOutput,
  //   stamina: number,
  //   resurrectionPrompt: string = "",
  // ): BossModel {
  //   return BossModel.create({
  //     id: monsterId,
  //     feature: monsterStruct.feature,
  //     name: monsterStruct.name,
  //     flavor: monsterStruct.flavor,
  //     skills: monsterStruct.skills,
  //     lv: Number(monsterStruct.lv),
  //     status: {
  //       HP: Number(monsterStruct.hp),
  //       ATK: Number(monsterStruct.atk),
  //       DEF: Number(monsterStruct.def),
  //       INT: Number(monsterStruct.inte),
  //       MGR: Number(monsterStruct.mgr),
  //       AGL: Number(monsterStruct.agl),
  //     },
  //     stamina: stamina,
  //     resurrectionPrompt: resurrectionPrompt,
  //   });
  // }

  // /**
  //  * fromJson
  //  * @param json json
  //  * @param lv level
  //  * @return {BossModel} BossModel
  //  */
  // public static fromData(
  //   json: any,
  //   feature: string,
  //   resurrectionPrompt: string,
  //   stamina: number = 0,
  //   lv: number = 1,
  // ): BossModel {
  //   return BossModel.create({
  //     feature: feature,
  //     name: json.name,
  //     flavor: json.flavor,
  //     skills: json.skills,
  //     lv: lv,
  //     status: json.status,
  //     stamina: stamina,
  //     resurrectionPrompt: resurrectionPrompt,
  //   });
  // }
}
