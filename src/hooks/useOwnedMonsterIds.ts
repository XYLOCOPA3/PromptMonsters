import { RPC_URL } from "@/lib/wallet";
import {
  OwnedMonsterIdsState,
  ownedMonsterIdsState,
} from "@/stores/ownedMonsterIdsState";
import { PromptMonsters__factory } from "@/typechain";
import { UserId } from "@/types/UserId";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface OwnedMonsterIdsController {
  init: (userId: UserId) => Promise<void>;
  reset: () => void;
}

export const useOwnedMonsterIdsValue = (): OwnedMonsterIdsState => {
  return useRecoilValue(ownedMonsterIdsState);
};

export const useOwnedMonsterIdsController = (): OwnedMonsterIdsController => {
  const setOwnedMonsterIds = useSetRecoilState(ownedMonsterIdsState);

  /**
   * Initialize ownedMonsterIds
   * @param userId user id
   */
  const init = async (userId: UserId): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(
      RPC_URL.mchVerseTestnet,
    );
    const promptMonsters = PromptMonsters__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      provider,
    );
    const monsterIdsNum = await promptMonsters.getOwnerToTokenIds(userId);
    const monsterIds: OwnedMonsterIdsState = [];
    for (let i = 0; i < monsterIdsNum.length; i++) {
      monsterIds.push(monsterIdsNum[i].toString());
    }
    setOwnedMonsterIds(monsterIds);
  };

  /**
   * Reset ownedMonsterIds
   */
  const reset = (): void => {
    setOwnedMonsterIds([]);
  };

  const controller: OwnedMonsterIdsController = {
    init,
    reset,
  };
  return controller;
};

export const useOwnedMonsterIdsState = (): [
  OwnedMonsterIdsState,
  OwnedMonsterIdsController,
] => [useOwnedMonsterIdsValue(), useOwnedMonsterIdsController()];
