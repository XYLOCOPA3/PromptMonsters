import { atom } from "recoil";

export const restorePriceState = atom<number>({
  key: "restorePriceState",
  default: 0,
});
