import { atom } from "recoil";

export type LanguageState = string;

export const languageState = atom<string>({
  key: "languageState",
  default: "English",
});
