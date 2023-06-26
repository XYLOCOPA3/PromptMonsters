import { atom } from "recoil";

export const bossMintPriceState = atom<number>({
  key: "bossMintPriceState",
  default: 0,
});
