import { BaseModel } from "@/models/BaseModel";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import { EnumBossBattlePhase } from "@/types/EnumBossBattlePhase";

/**
 * BossBattleModel
 * @model
 * @keit0728
 */
export class BossBattleModel extends BaseModel<string> {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyUser = BossBattleModel.create({ id: "dummyId" });
   * ```
   */
  private constructor(
    public readonly bossBattleStarted: boolean = false,
    public readonly bossBattleContinued: boolean = false,
    public readonly lp: number = 400,
    public readonly turn: number = 0,
    public readonly score: number = 0,
    public readonly bossSign: number = 0,
    public readonly hasHealItem: boolean = false,
    public readonly hasBuffItem: boolean = false,
    public readonly hasDebuffItem: boolean = false,
    public readonly hasEscapeItem: boolean = false,
    public readonly phase: EnumBossBattlePhase = EnumBossBattlePhase.start,
    public readonly usedMonsterSkill: string = "",
    public readonly currentBossDamage: number = 0,
    public readonly currentMonsterDamage: number = 0,
    public readonly currentHealing: number = 0,
    public readonly currentMonsterHit: boolean = false,
    public readonly currentBossHit: boolean = false,
    public readonly resultMsgIds: EnumBossBattleMsg[] = [],
    public readonly defensed: boolean = false,

    // TODO: 要検討
    public readonly itemIds: number[] = [],
    public readonly droppedItemId: number = -1,
    public readonly setItemId: number = -1,
    public readonly usedItemId: number = -1,
    public readonly usedBossSkill: string = "",
    public readonly defeated: boolean = false,
  ) {
    super("");
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {BossBattleModel} BossBattleModel
   */
  public static create(modifyObject: {
    [P in keyof BossBattleModel]?: BossBattleModel[P];
  }): BossBattleModel {
    return new BossBattleModel().copyWith(modifyObject);
  }
}
