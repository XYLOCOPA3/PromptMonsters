import { atom } from "recoil";

export const mintPriceState = atom<number>({
  key: "mintPriceState",
  default: 0,
});
