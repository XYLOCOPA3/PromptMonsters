import { mintPriceState } from "@/stores/mintPriceState";
import axios from "axios";
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
    const res = await axios.post("/api/get-mint-price");
    if (res.status !== 200) throw new Error(res.data.message);
    setMintPrice(res.data.mintPrice);
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
