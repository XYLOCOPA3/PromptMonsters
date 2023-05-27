import { BossBattleModel } from "@/models/BossBattleModel";
import { atom } from "recoil";

export type BossBattleState = BossBattleModel;

export const bossBattleState = atom<BossBattleState>({
  key: "bossBattleState",
  default: BossBattleModel.create({}),
});
