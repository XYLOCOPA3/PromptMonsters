import { atom } from "recoil";

export const userInitState = atom<boolean>({
  key: "userInitState",
  default: false,
});
