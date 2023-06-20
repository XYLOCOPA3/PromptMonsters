import {
  K_BOSS_ATK,
  K_BOSS_BUFF,
  K_BOSS_DEBUFF,
  K_BOSS_DEF,
  K_BOSS_INT,
  K_BOSS_MGR,
  K_BOSS_POWER,
  K_MONSTER_ATK,
  K_MONSTER_BUFF,
  K_MONSTER_DEBUFF,
  K_MONSTER_DEF,
  K_MONSTER_HEALING,
  K_MONSTER_INT,
  K_MONSTER_MGR,
  K_MONSTER_POWER,
  K_MONSTER_WEAKNESS,
  K_TURN,
} from "@/const/bossBattle";
import { ObjectCopier } from "@/models/ObjectCopier";

export class BBkParamModel extends ObjectCopier {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyMonster = DevBBkParamModel.create({ language: "English" });
   * ```
   */
  private constructor(
    // 共通
    public readonly kTurn: string = K_TURN, // ターン被ダメ上昇率

    // モンスター
    public readonly kMonsterAtk: string = K_MONSTER_ATK,
    public readonly kMonsterDef: string = K_MONSTER_DEF,
    public readonly kMonsterInt: string = K_MONSTER_INT,
    public readonly kMonsterMgr: string = K_MONSTER_MGR,
    public readonly kMonsterBuff: string = K_MONSTER_BUFF, // バフ倍率
    public readonly kMonsterDebuff: string = K_MONSTER_DEBUFF, // デバフ倍率
    public readonly kMonsterPower: string = K_MONSTER_POWER, // 強攻撃倍率
    public readonly kMonsterHealing: string = K_MONSTER_HEALING, // 回復料倍率
    public readonly kMonsterWeakness: string = K_MONSTER_WEAKNESS, // 弱点特徴倍率

    // ボス
    public readonly kBossAtk: string = K_BOSS_ATK,
    public readonly kBossDef: string = K_BOSS_DEF,
    public readonly kBossInt: string = K_BOSS_INT,
    public readonly kBossMgr: string = K_BOSS_MGR,
    public readonly kBossBuff: string = K_BOSS_BUFF, // バフ倍率
    public readonly kBossDebuff: string = K_BOSS_DEBUFF, // デバフ倍率
    public readonly kBossPower: string = K_BOSS_POWER, // 強攻撃倍率
  ) {
    super();
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {BBkParamModel} DevBBkParamModel
   */
  public static create(modifyObject: {
    [P in keyof BBkParamModel]?: BBkParamModel[P];
  }): BBkParamModel {
    return new BBkParamModel().copyWith(modifyObject);
  }
}
