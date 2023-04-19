import { atom } from "recoil";

export const fightTextState = atom<string>({
  key: "fightTextState",
  default: "",
});
