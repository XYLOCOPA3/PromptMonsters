import { MonsterModel } from "@/models/MonsterModel";
import { MintedBossState, mintedBossState } from "@/stores/mintedBossState";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface MintedBossController {
  set: (monster: MonsterModel) => void;
}

export const useMintedBossValue = (): MintedBossState => {
  return useRecoilValue(mintedBossState);
};

export const useMintedBossController = (): MintedBossController => {
  const setMintedBoss = useSetRecoilState(mintedBossState);

  /**
   * set
   */
  const set = (monster: MonsterModel): void => {
    setMintedBoss(monster);
  };

  const controller: MintedBossController = {
    set,
  };
  return controller;
};

export const useMintedBossState = (): [
  MintedBossState,
  MintedBossController,
] => [useMintedBossValue(), useMintedBossController()];
