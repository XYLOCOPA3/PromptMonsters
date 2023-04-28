import { RPC_URL } from "@/lib/wallet";
import { MonsterModel } from "@/models/MonsterModel";
import {
  OwnedMonstersState,
  ownedMonstersState,
} from "@/stores/ownedMonstersState";
import { PromptMonsters__factory } from "@/typechain";
import { UserId } from "@/types/UserId";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface OwnedMonsterIdsController {
  init: (userId: UserId) => Promise<void>;
  reset: () => void;
  add: (newMonster: MonsterModel) => void;
  updateAfterMinted: (newMonster: MonsterModel) => void;
}

export const useOwnedMonstersValue = (): OwnedMonstersState => {
  return useRecoilValue(ownedMonstersState);
};

export const useOwnedMonstersController = (): OwnedMonsterIdsController => {
  const setOwnedMonsters = useSetRecoilState(ownedMonstersState);

  /**
   * Initialize ownedMonsters
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
    const monsterStructs = await promptMonsters.getMonsters(monsterIdsNum);
    const monsters: OwnedMonstersState = [];
    for (let i = 0; i < monsterStructs.length; i++) {
      monsters.push(
        MonsterModel.fromContract(
          monsterIdsNum[i].toString(),
          monsterStructs[i],
        ),
      );
    }
    setOwnedMonsters(monsters);
  };

  /**
   * Reset ownedMonsters
   */
  const reset = (): void => {
    setOwnedMonsters([]);
  };

  /**
   * Add ownedMonsters
   * @param newMonster new monster
   */
  const add = (newMonster: MonsterModel): void => {
    setOwnedMonsters((prevState) => [...prevState, newMonster]);
  };

  /**
   * Update ownedMonsters after minted
   * @param newMonster new monster
   */
  const updateAfterMinted = (newMonster: MonsterModel): void => {
    setOwnedMonsters((prevState) => {
      return prevState.map((monster) => {
        if (monster.name === newMonster.name) {
          return monster.copyWith({ id: newMonster.id });
        }
        return monster;
      });
    });
  };

  const controller: OwnedMonsterIdsController = {
    init,
    reset,
    add,
    updateAfterMinted,
  };
  return controller;
};

export const useOwnedMonstersState = (): [
  OwnedMonstersState,
  OwnedMonsterIdsController,
] => [useOwnedMonstersValue(), useOwnedMonstersController()];
