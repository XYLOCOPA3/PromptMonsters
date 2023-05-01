import { calcStamina } from "@/features/stamina/utils/calcStamina";
import { RPC_URL } from "@/lib/wallet";
import { MonsterModel } from "@/models/MonsterModel";
import {
  OwnedMonstersState,
  ownedMonstersState,
} from "@/stores/ownedMonstersState";
import { PromptMonsters__factory, Stamina__factory } from "@/typechain";
import { UserId } from "@/types/UserId";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface OwnedMonsterIdsController {
  init: (userId: UserId, monster: MonsterModel) => Promise<void>;
  reset: () => void;
  add: (newMonster: MonsterModel) => void;
  updateAfterMinted: (newMonster: MonsterModel) => void;
  update: (index: number, newMonster: MonsterModel) => void;
}

export const useOwnedMonstersValue = (): OwnedMonstersState => {
  return useRecoilValue(ownedMonstersState);
};

export const useOwnedMonstersController = (): OwnedMonsterIdsController => {
  const setOwnedMonsters = useSetRecoilState(ownedMonstersState);

  /**
   * Initialize ownedMonsters
   * @param userId user id
   * @param monster monster
   */
  const init = async (userId: UserId, monster: MonsterModel): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const promptMonsters = PromptMonsters__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      provider,
    );
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );
    const monsterIdsNum = await promptMonsters.getOwnerToTokenIds(userId);
    if (monsterIdsNum.length === 0) return;
    const results = await Promise.all([
      promptMonsters.getMonsters(monsterIdsNum),
      stamina.getTimeStds(monsterIdsNum),
      stamina.staminaLimit(),
      stamina.staminaRecoveryTime(),
    ]);
    const monsterStructs = results[0];
    const timeStds = results[1];
    const staminaLimit = results[2];
    const staminaRecoveryTime = results[3];
    const monsterStaminas = timeStds.map((timeStd) => {
      return calcStamina(timeStd, staminaLimit, staminaRecoveryTime);
    });
    const monsters: OwnedMonstersState = [];
    for (let i = 0; i < monsterStructs.length; i++) {
      monsters.push(
        MonsterModel.fromContract(
          monsterIdsNum[i].toString(),
          monsterStructs[i],
          monsterStaminas[i],
        ),
      );
    }
    if (monster.id === "" && monster.name !== "") monsters.push(monster);
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

  /**
   * Update ownedMonsters after minted
   * @param index index
   * @param newMonster new monster
   */
  const update = (index: number, newMonster: MonsterModel): void => {
    setOwnedMonsters((prevState) => {
      return prevState.map((monster, i) => {
        if (index === i) {
          return newMonster;
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
    update,
  };
  return controller;
};

export const useOwnedMonstersState = (): [
  OwnedMonstersState,
  OwnedMonsterIdsController,
] => [useOwnedMonstersValue(), useOwnedMonstersController()];
