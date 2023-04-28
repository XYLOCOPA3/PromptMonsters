import { atom } from "recoil";

export const disableState = atom<boolean>({
  key: "disableState",
  default: false,
});
