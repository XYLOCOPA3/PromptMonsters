import { CHAINID_LINEA } from "@/const/chainParams";
import { dummyUserState } from "@/const/dummy";
import { ClientWallet } from "@/lib/wallet";
import { UserState, userState } from "@/stores/userState";
import { UserId } from "@/types/UserId";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface UserController {
  login: () => Promise<UserId>;
}

export const useUserValue = (): UserState => {
  return useRecoilValue(userState);
};

export const useUserController = (): UserController => {
  const setUser = useSetRecoilState(userState);

  /**
   * Login
   */
  const login = async (): Promise<UserId> => {
    const wallet = await ClientWallet.instance();
    const chainId = (await wallet.getChainId()).toLowerCase();
    if (chainId !== CHAINID_LINEA)
      await wallet.switchChainIfNotExistAdd(CHAINID_LINEA);
    const address = (await wallet.connect())[0];
    setUser(dummyUserState.copyWith({ id: address }));
    return address;
  };

  const controller: UserController = {
    login,
  };
  return controller;
};

export const useUserState = (): [UserState, UserController] => [
  useUserValue(),
  useUserController(),
];
