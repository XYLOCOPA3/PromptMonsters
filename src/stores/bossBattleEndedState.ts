import { atom } from "recoil";

export const bossBattleEndedState = atom<boolean>({
  key: "bossBattleEndedState",
  default: false,
});
