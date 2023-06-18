import { ClientStamina } from "@/features/stamina/api/contracts/ClientStamina";
import { restorePriceState } from "@/stores/restorePriceState";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface RestorePriceController {
  init: () => void;
}

export const useRestorePriceValue = (): number => {
  return useRecoilValue(restorePriceState);
};

export const useRestorePriceController = (): RestorePriceController => {
  const setRestorePrice = useSetRecoilState(restorePriceState);

  /**
   * init
   */
  const init = async (): Promise<void> => {
    const stamina = ClientStamina.instance();

    setRestorePrice(
      Number(ethers.utils.formatEther(await stamina.getRestorePrice())),
    );
  };

  const controller: RestorePriceController = {
    init,
  };
  return controller;
};

export const useRestorePriceState = (): [number, RestorePriceController] => [
  useRestorePriceValue(),
  useRestorePriceController(),
];
