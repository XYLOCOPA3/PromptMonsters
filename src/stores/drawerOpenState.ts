import { atom } from "recoil";

export const drawerOpenState = atom<boolean>({
  key: "drawerOpenState",
  default: false,
});
