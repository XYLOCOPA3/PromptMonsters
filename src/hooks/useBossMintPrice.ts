import { ClientPromptMonsters } from "@/features/monster/api/contracts/ClientPromptMonsters";
import { bossMintPriceState } from "@/stores/bossMintPriceState";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface BossMintPriceController {
  init: () => Promise<void>;
  reset: () => void;
}

export const useBossMintPriceValue = (): number => {
  return useRecoilValue(bossMintPriceState);
};

export const useBossMintPriceController = (): BossMintPriceController => {
  const setBossMintPrice = useSetRecoilState(bossMintPriceState);

  /**
   * Set bossMintPrice
   * @param bossMintPrice Mint price
   */
  const init = async (): Promise<void> => {
    const bossBattle = ClientPromptMonsters.instance();
    setBossMintPrice(
      Number(ethers.utils.formatEther(await bossBattle.getMintPrice())),
    );
  };

  /**
   * Reset bossMintPrice
   */
  const reset = (): void => {
    setBossMintPrice(0);
  };

  const controller: BossMintPriceController = {
    init,
    reset,
  };
  return controller;
};

export const useBossMintPriceState = (): [number, BossMintPriceController] => [
  useBossMintPriceValue(),
  useBossMintPriceController(),
];
