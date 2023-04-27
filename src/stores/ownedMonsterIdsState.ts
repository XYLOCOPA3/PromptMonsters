import { MonsterId } from "@/types/MonsterId";
import { atom } from "recoil";

export type OwnedMonsterIdsState = MonsterId[];

export const ownedMonsterIdsState = atom<MonsterId[]>({
  key: "ownedMonsterIdsState",
  default: [],
});
