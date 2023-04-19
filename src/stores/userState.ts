import { UserModel } from "@/models/UserModel";
import { atom } from "recoil";

export type UserState = UserModel;

export const userState = atom<UserState>({
  key: "userState",
  default: UserModel.create({}),
});
