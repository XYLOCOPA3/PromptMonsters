import { BattleModel } from "@/models/BattleModel";
import { atom } from "recoil";

export type BattleState = BattleModel;

export const battleState = atom<BattleState>({
  key: "battleState",
  default: BattleModel.create({}),
});
