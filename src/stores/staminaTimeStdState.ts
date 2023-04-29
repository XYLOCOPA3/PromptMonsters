import { StaminaTime } from "@/types/StaminaTime";
import { atom } from "recoil";

export const staminaTimeStdState = atom<StaminaTime>({
  key: "staminaTimeStdState",
  default: { hours: 0, minutes: 0, seconds: 0 },
});
