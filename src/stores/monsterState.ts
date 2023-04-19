import { MonsterModel } from "@/models/MonsterModel";
import { atom } from "recoil";

export type MonsterState = MonsterModel;

export const monsterState = atom<MonsterState>({
  key: "monsterState",
  default: MonsterModel.create({}),
});
