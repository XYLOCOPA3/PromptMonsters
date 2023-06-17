import { atom } from "recoil";

export type LanguageState = string;

export const languageState = atom<LanguageState>({
  key: "languageState",
  default: "",
});
