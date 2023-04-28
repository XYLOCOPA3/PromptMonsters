import { atom } from "recoil";

export const selectedMonsterIdNameState = atom<string>({
  key: "selectedMonsterIdNameState",
  default: "",
});
