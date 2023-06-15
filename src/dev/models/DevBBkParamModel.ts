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
    public readonly kCommonTurn: string = "1.1", // ターン被ダメ上昇率

    // モンスター
    public readonly kMonsterAtk: string = "1.0",
    public readonly kMonsterDef: string = "1.0",
    public readonly kMonsterInt: string = "1.0",
    public readonly kMonsterMgr: string = "1.0",
    public readonly kMonsterBuff: string = "1.2", //  バフ倍率
    public readonly kMonsterDebuff: string = "0.75", // デバフ倍率
    public readonly kMonsterPower: string = "1.5", // 強攻撃倍率
    public readonly kMonsterHealing: string = "10.0", // 回復料倍率
    public readonly kMonsterWeakness: string = "1.0", // 弱点特徴倍率

    // ボス
    public readonly kBossAtk: string = "1.0",
    public readonly kBossDef: string = "1.0",
    public readonly kBossInt: string = "1.0",
    public readonly kBossMgr: string = "1.0",
    public readonly kBossBuff: string = "1.5", //  バフ倍率
    public readonly kBossDebuff: string = "0.8", // デバフ倍率
    public readonly kBossPower: string = "1.5", // 強攻撃倍率
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
