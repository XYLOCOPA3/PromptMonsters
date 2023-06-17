import { atom } from "recoil";

export type DevOnOffState = boolean;

export const devOnOffState = atom<DevOnOffState>({
  key: "devOnOffState",
  default: false,
});
