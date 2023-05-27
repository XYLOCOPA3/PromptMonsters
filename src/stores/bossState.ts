import { BossModel } from "@/models/BossModel";
import { atom } from "recoil";

export type BossState = BossModel;

export const bossState = atom<BossState>({
  key: "bossState",
  default: BossModel.create({}),
});
