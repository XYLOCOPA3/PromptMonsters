import { atom } from "recoil";

export type MonsterInitState = boolean;

export const monsterInitState = atom<MonsterInitState>({
  key: "monsterInitState",
  default: false,
});
