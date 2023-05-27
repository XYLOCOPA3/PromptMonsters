import { ObjectCopier } from "@/models/ObjectCopier";
import { MonsterId } from "@/types/MonsterId";

export class BattleModel extends ObjectCopier {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = BattleModel.create({ language: "English" });
   * ```
   * @param battleAnalysis battle analysis
   * @param battleDescription battle description
   * @param monsterBId monster B id
   * @param winnerId winner id
   */
  private constructor(
    public readonly battleAnalysis: string = "",
    public readonly battleDescription: string = "",
    public readonly monsterBId: string = "",
    public readonly winnerId: MonsterId = "",
  ) {
    super();
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {BattleModel} BattleModel
   */
  public static create(modifyObject: {
    [P in keyof BattleModel]?: BattleModel[P];
  }): BattleModel {
    return new BattleModel().copyWith(modifyObject);
  }
}
