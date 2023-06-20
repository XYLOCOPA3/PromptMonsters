import { BBkParamModel } from "@/models/BBkParamModel";
import { atom } from "recoil";

export type BBKState = BBkParamModel;

export const bbKParamState = atom<BBKState>({
  key: "bbKParamState",
  default: BBkParamModel.create({}),
});
