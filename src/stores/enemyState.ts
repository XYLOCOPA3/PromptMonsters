import { MonsterModel } from "@/models/MonsterModel";
import { atom } from "recoil";

export type EnemyState = MonsterModel;

export const enemyState = atom<EnemyState>({
  key: "enemyState",
  default: MonsterModel.create({}),
});
