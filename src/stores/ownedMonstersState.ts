import { MonsterModel } from "@/models/MonsterModel";
import { atom } from "recoil";

export type OwnedMonstersState = MonsterModel[];

export const ownedMonstersState = atom<OwnedMonstersState>({
  key: "ownedMonstersState",
  default: [],
});
