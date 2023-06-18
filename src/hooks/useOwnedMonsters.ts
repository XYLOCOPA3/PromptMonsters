import { ClientPromptMonsters } from "@/features/monster/api/contracts/ClientPromptMonsters";
import { ClientStamina } from "@/features/stamina/api/contracts/ClientStamina";
import { calcStamina } from "@/features/stamina/utils/calcStamina";
import { MonsterModel } from "@/models/MonsterModel";
import {
  OwnedMonstersState,
  ownedMonstersState,
} from "@/stores/ownedMonstersState";
import { UserId } from "@/types/UserId";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface OwnedMonsterIdsController {
  init: (userId: UserId, ownedMonsters: MonsterModel[]) => Promise<void>;
  reset: () => void;
  add: (newMonster: MonsterModel) => void;
  updateAfterMinted: (newMonster: MonsterModel) => void;
  update: (index: number, newMonster: MonsterModel) => void;
  updateUsingRp: (resurrectionPrompt: string, newMonster: MonsterModel) => void;
}

export const useOwnedMonstersValue = (): OwnedMonstersState => {
  return useRecoilValue(ownedMonstersState);
};

export const useOwnedMonstersController = (): OwnedMonsterIdsController => {
  const setOwnedMonsters = useSetRecoilState(ownedMonstersState);

  /**
   * Initialize ownedMonsters
   * @param userId user id
   * @param ownedMonsters owned monsters
   */
  const init = async (
    userId: UserId,
    ownedMonsters: MonsterModel[],
  ): Promise<void> => {
    const promptMonsters = ClientPromptMonsters.instance();
    const monsterIdsNum = await promptMonsters.getOwnerToTokenIds(userId);
    if (monsterIdsNum.length === 0) return;
    const monsterIds = monsterIdsNum.map((monsterId) => monsterId.toString());
    const resurrectionPrompts = await promptMonsters.getResurrectionPrompts(
      monsterIds,
    );
    const stamina = ClientStamina.instance();
    const results = await Promise.all([
      promptMonsters.getMonsterExtensions(resurrectionPrompts),
      stamina.getTimeStds(monsterIds),
      stamina.getStaminaLimit(),
      stamina.getStaminaRecoveryTime(),
    ]);
    const monsterExtensionStructs = results[0];
    const timeStds = results[1];
    const staminaLimit = results[2];
    const staminaRecoveryTime = results[3];
    const monsterStaminas = timeStds.map((timeStd) => {
      return calcStamina(timeStd, staminaLimit, staminaRecoveryTime);
    });
    const monsters: OwnedMonstersState = [];
    for (let i = 0; i < monsterExtensionStructs.length; i++) {
      monsters.push(
        MonsterModel.fromContract(
          monsterIds[i],
          monsterExtensionStructs[i],
          monsterStaminas[i],
        ),
      );
    }
    for (let i = 0; i < ownedMonsters.length; i++) {
      if (ownedMonsters[i].id === "") monsters.push(ownedMonsters[i]);
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

  /**
   * Update ownedMonsters after minted
   * @param index index
   * @param newMonster new monster
   */
  const updateUsingRp = (
    resurrectionPrompt: string,
    newMonster: MonsterModel,
  ): void => {
    setOwnedMonsters((prevState) => {
      return prevState.map((monster) => {
        if (resurrectionPrompt === monster.resurrectionPrompt) {
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
    updateUsingRp,
  };
  return controller;
};

export const useOwnedMonstersState = (): [
  OwnedMonstersState,
  OwnedMonsterIdsController,
] => [useOwnedMonstersValue(), useOwnedMonstersController()];
