import { ObjectCopier } from "@/models/ObjectCopier";
import { MonsterId } from "@/types/MonsterId";

export class BattleModel extends ObjectCopier {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = BattleModel.create({ language: "Japanese" });
   * ```
   * @param language language
   * @param battleDesc battle description
   * @param enemyName enemy name
   * @param winnerId winner id
   */
  private constructor(
    public readonly language: string = "",
    public readonly battleDesc: string = "",
    public readonly enemyName: string = "",
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
