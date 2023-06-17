import { atom } from "recoil";

export const scoreOpenedState = atom<boolean>({
  key: "scoreOpenedState",
  default: false,
});
