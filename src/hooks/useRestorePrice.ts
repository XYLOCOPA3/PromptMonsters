import { RPC_URL } from "@/const/chainParams";
import { restorePriceState } from "@/stores/restorePriceState";
import { Stamina__factory } from "@/typechain";
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
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );

    setRestorePrice(
      Number(ethers.utils.formatEther(await stamina.restorePrice())),
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
