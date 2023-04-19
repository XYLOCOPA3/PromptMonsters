import { atom } from "recoil";

export const monsterMintedState = atom<boolean>({
  key: "monsterMintedState",
  default: false,
});
