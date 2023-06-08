import { atom } from "recoil";

export type LocaleState = string;

export const localeState = atom<string>({
  key: "localeState",
  default: "en",
});
