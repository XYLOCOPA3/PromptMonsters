import { atom } from "recoil";

export const selectedMonsterNameState = atom<string>({
  key: "selectedMonsterNameState",
  default: "",
});
