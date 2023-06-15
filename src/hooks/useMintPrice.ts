import { ClientPromptMonsters } from "@/features/monster/api/contracts/ClientPromptMonsters";
import { mintPriceState } from "@/stores/mintPriceState";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface MintPriceController {
  init: () => Promise<void>;
  reset: () => void;
}

export const useMintPriceValue = (): number => {
  return useRecoilValue(mintPriceState);
};

export const useMintPriceController = (): MintPriceController => {
  const setMintPrice = useSetRecoilState(mintPriceState);

  /**
   * Set mintPrice
   * @param mintPrice Mint price
   */
  const init = async (): Promise<void> => {
    const promptMonsters = ClientPromptMonsters.instance();
    setMintPrice(
      Number(ethers.utils.formatEther(await promptMonsters.getMintPrice())),
    );
  };

  /**
   * Reset mintPrice
   */
  const reset = (): void => {
    setMintPrice(0);
  };

  const controller: MintPriceController = {
    init,
    reset,
  };
  return controller;
};

export const useMintPriceState = (): [number, MintPriceController] => [
  useMintPriceValue(),
  useMintPriceController(),
];
