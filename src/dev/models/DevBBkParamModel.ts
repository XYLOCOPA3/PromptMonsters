import { ObjectCopier } from "@/models/ObjectCopier";

export class DevBBkParamModel extends ObjectCopier {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = DevBBkParamModel.create({ language: "English" });
   * ```
   */
  private constructor(
    // 共通
    public readonly kCommonTurn: number = 1.1, // ターン被ダメ上昇率

    // モンスター
    public readonly kMonsterAtk: number = 1.0,
    public readonly kMonsterDef: number = 1.0,
    public readonly kMonsterInt: number = 1.0,
    public readonly kMonsterMgr: number = 1.0,
    public readonly kMonsterBuff: number = 1.2, //  バフ倍率
    public readonly kMonsterDebuff: number = 0.75, // デバフ倍率
    public readonly kMonsterPower: number = 1.5, // 強攻撃倍率
    public readonly kMonsterHealing: number = 10.0, // 回復料倍率
    public readonly kMonsterWeakness: number = 1.2, // 弱点特徴倍率

    // ボス
    public readonly kBossAtk: number = 1.0,
    public readonly kBossDef: number = 1.0,
    public readonly kBossInt: number = 1.0,
    public readonly kBossMgr: number = 1.0,
    public readonly kBossBuff: number = 1.5, //  バフ倍率
    public readonly kBossDebuff: number = 0.8, // デバフ倍率
    public readonly kBossPower: number = 1.5, // 強攻撃倍率
  ) {
    super();
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {DevBBkParamModel} DevBBkParamModel
   */
  public static create(modifyObject: {
    [P in keyof DevBBkParamModel]?: DevBBkParamModel[P];
  }): DevBBkParamModel {
    return new DevBBkParamModel().copyWith(modifyObject);
  }
}
