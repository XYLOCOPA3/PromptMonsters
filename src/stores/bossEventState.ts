import { BossEvent } from "@/types/BossEvent";
import { atom } from "recoil";

export type BossEventState = BossEvent;

export const bossEventState = atom<BossEventState>({
  key: "bossEventState",
  default: {
    eventKey: "",
    bbeId: "",
  },
});
