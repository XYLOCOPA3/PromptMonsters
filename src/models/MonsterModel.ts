import { BaseModel } from "@/models/BaseModel";
import { IPromptMonstersExtension } from "@/typechain/PromptMonsters";
import { MonsterId } from "@/types/MonsterId";
import { Status } from "@/types/Status";

export class MonsterModel extends BaseModel<MonsterId> {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = MonsterModel.create({ id: "dummyId" });
   * ```
   * @param feature feature
   * @param name name
   * @param flavor flavor text
   * @param skills skills
   * @param lv level
   * @param status status
   * @param stamina stamina
   * @param resurrectionPrompt resurrection prompt
   * @param imageURL image URL
   * @param skillTypes skill types
   */
  constructor(
    public readonly feature: string = "",
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
    public readonly stamina: number = 0,
    public readonly resurrectionPrompt: string = "",
    public readonly imageURL: string = "",
    public readonly skillTypes: number[] = [],
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
   * @param monsterExtensionStruct monster extension struct
   * @return {MonsterModel} MonsterModel
   */
  public static fromContract(
    monsterId: string,
    monsterExtensionStruct: IPromptMonstersExtension.MonsterExtensionStructOutput,
    stamina: number,
  ): MonsterModel {
    return MonsterModel.create({
      id: monsterId,
      feature: monsterExtensionStruct.feature,
      name: monsterExtensionStruct.name,
      flavor: monsterExtensionStruct.flavor,
      skills: monsterExtensionStruct.skills,
      lv: Number(monsterExtensionStruct.lv),
      status: {
        HP: Number(monsterExtensionStruct.hp),
        ATK: Number(monsterExtensionStruct.atk),
        DEF: Number(monsterExtensionStruct.def),
        INT: Number(monsterExtensionStruct.inte),
        MGR: Number(monsterExtensionStruct.mgr),
        AGL: Number(monsterExtensionStruct.agl),
      },
      stamina: stamina,
      resurrectionPrompt: monsterExtensionStruct.resurrectionPrompt,
      skillTypes: monsterExtensionStruct.skillTypes,
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
    feature: string,
    resurrectionPrompt: string,
    stamina: number = 0,
    lv: number = 1,
  ): MonsterModel {
    return MonsterModel.create({
      feature: feature,
      name: json.name,
      flavor: json.flavor,
      skills: json.skills,
      lv: lv,
      status: json.status,
      stamina: stamina,
      resurrectionPrompt: resurrectionPrompt,
    });
  }
}
