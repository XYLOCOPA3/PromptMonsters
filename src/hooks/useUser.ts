import { UserModel } from "@/models/UserModel";
import { UserState, userState } from "@/stores/userState";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface UserController {
  set: (address: string, freePlay: boolean) => void;
  reset: () => void;
  create: () => string;
}

export const useUserValue = (): UserState => {
  return useRecoilValue(userState);
};

export const useUserController = (): UserController => {
  const setUser = useSetRecoilState(userState);

  /**
   * set
   * @param address user address
   * @param freePlay free play
   */
  const set = (address: string, freePlay: boolean): void => {
    setUser(UserModel.create({ id: address, freePlay: freePlay }));
  };

  /**
   * reset
   */
  const reset = (): void => {
    setUser(UserModel.create({}));
  };

  /**
   * create
   */
  const create = (): string => {
    const wallet = ethers.Wallet.createRandom();
    setUser((prevState) => {
      return prevState.copyWith({
        id: wallet.address,
        privateKey: wallet.privateKey,
      });
    });
    return wallet.address;
  };

  const controller: UserController = {
    set,
    reset,
    create,
  };
  return controller;
};

export const useUserState = (): [UserState, UserController] => [
  useUserValue(),
  useUserController(),
];
