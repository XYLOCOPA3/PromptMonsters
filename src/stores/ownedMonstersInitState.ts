import { atom } from "recoil";

export type OwnedMonstersInitState = boolean;

export const ownedMonstersInitState = atom<OwnedMonstersInitState>({
  key: "ownedMonstersInitState",
  default: false,
});
