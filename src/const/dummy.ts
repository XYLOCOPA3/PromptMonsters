import { UserModel } from "@/models/UserModel";
import uuid from "react-uuid";

export const dummyUserState = UserModel.create({
  id: uuid(),
  name: "keit",
  email: "example@gmail.com",
  // icon: "/assets/images/dummy_icon.svg",
  icon: "/assets/images/prompt-monster-icon.svg",
});
