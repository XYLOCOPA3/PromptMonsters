import { DevBBkParamModel } from "@/dev/models/DevBBkParamModel";
import { atom } from "recoil";

export type DevBBKState = DevBBkParamModel;

export const devBBkParamState = atom<DevBBKState>({
  key: "devBBkParamState",
  default: DevBBkParamModel.create({}),
});
