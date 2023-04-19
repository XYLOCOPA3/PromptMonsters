import { UserModel } from "@/models/UserModel";
import { UserState, userState } from "@/stores/userState";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface UserController {
  set: (address: string) => Promise<void>;
  reset: () => void;
}

export const useUserValue = (): UserState => {
  return useRecoilValue(userState);
};

export const useUserController = (): UserController => {
  const setUser = useSetRecoilState(userState);

  /**
   * set
   * @param address user address
   */
  const set = async (address: string): Promise<void> => {
    setUser(UserModel.create({ id: address }));
  };

  /**
   * reset
   */
  const reset = (): void => {
    setUser(UserModel.create({}));
  };

  const controller: UserController = {
    set,
    reset,
  };
  return controller;
};

export const useUserState = (): [UserState, UserController] => [
  useUserValue(),
  useUserController(),
];
