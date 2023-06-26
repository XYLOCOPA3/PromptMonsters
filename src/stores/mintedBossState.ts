import { MonsterModel } from "@/models/MonsterModel";
import { atom } from "recoil";

export type MintedBossState = MonsterModel;

export const mintedBossState = atom<MintedBossState>({
  key: "mintedBossState",
  default: MonsterModel.create({}),
});
