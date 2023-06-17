import { RPC_URL } from "@/const/chainParams";
import { MAX_FEATURES_CHAR, MAX_STAMINA } from "@/const/monster";
import { ClientMCHCoin } from "@/features/mchcoin/api/ClientMCHCoin";
import { ClientPromptMonsters } from "@/features/monster/api/contracts/ClientPromptMonsters";
import { ClientStamina } from "@/features/stamina/api/ClientStamina";
import { MonsterModel } from "@/models/MonsterModel";
import { MonsterState, monsterState } from "@/stores/monsterState";
import { FeatureErrorType } from "@/types/FeatureErrorType";
import { MonsterId } from "@/types/MonsterId";
import { UserId } from "@/types/UserId";
import { checkFeature } from "@/utils/validation";
import axios from "axios";
import { getCookie } from "cookies-next";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface MonsterController {
  generate: (feature: string, language: string) => Promise<MonsterModel>;
  mint: (userId: UserId, resurrectionPrompt: string) => Promise<MonsterModel>;
  set: (monster: MonsterModel) => void;
  reset: () => void;
  fight: (
    monsterId: MonsterId,
    language: string,
    resurrectionPrompt: string,
  ) => Promise<string>;
  resurrect: (resurrectionPrompt: string) => Promise<MonsterModel>;
  restoreStamina: (
    monsterId: MonsterId,
    restorePrice: number,
    userId: UserId,
  ) => Promise<void>;
  init: () => Promise<void>;
}

export const useMonsterValue = (): MonsterState => {
  return useRecoilValue(monsterState);
};

export const useMonsterController = (): MonsterController => {
  const setMonster = useSetRecoilState(monsterState);

  /**
   * Generate monster
   * @param feature monster feature
   * @param language output language
   * @return {MonsterModel} MonsterModel
   */
  const generate = async (
    feature: string,
    language: string,
  ): Promise<MonsterModel> => {
    const result = checkFeature(feature);
    if (result !== FeatureErrorType.ok) {
      switch (result) {
        case FeatureErrorType.noFeature:
          throw new Error("Do not empty feature");
        case FeatureErrorType.characterLimit:
          throw new Error(
            `Too many characters.\n\nPlease limit the number of characters to ${MAX_FEATURES_CHAR} for single-byte characters and ${
              MAX_FEATURES_CHAR / 3
            } for double-byte characters.`,
          );
        case FeatureErrorType.usingSymbol:
          throw new Error("Do not use symbol");
        case FeatureErrorType.usingNum:
          throw new Error("Do not use number");
        case FeatureErrorType.usingNGWord:
          throw new Error("Do not use NG word");
        default:
          throw new Error("Unknown error");
      }
    }
    let res: any;
    try {
      res = await axios.post("/api/generate-monster", {
        feature,
        language,
        transitional: {
          silentJSONParsing: false,
        },
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }
    if (res.status !== 200) throw new Error(res.data);
    const monsterJson = res.data.monster;
    const resurrectionPrompt = res.data.resurrectionPrompt;
    const monster = MonsterModel.fromData(
      monsterJson,
      feature,
      resurrectionPrompt,
      MAX_STAMINA,
    );
    setMonster(monster);
    return monster;
  };

  /**
   * Mint monster
   * @param userId user id
   */
  const mint = async (
    userId: UserId,
    resurrectionPrompt: string,
  ): Promise<MonsterModel> => {
    const promptMonsters = ClientPromptMonsters.instance();
    const mchcoin = ClientMCHCoin.instance();
    const results1 = await Promise.all([
      promptMonsters.getMintPrice(),
      mchcoin.getBalanceOf(userId),
      mchcoin.getAllowance(
        userId,
        process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      ),
    ]);
    const monsterPrice = results1[0];
    const balanceOfMchc = results1[1];
    if (balanceOfMchc.lt(monsterPrice))
      throw new Error("Insufficient balance of MCHC.");
    const allowance = results1[2];
    if (allowance.lt(monsterPrice)) {
      await mchcoin.approve(
        process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
        monsterPrice,
      );
    }
    await promptMonsters.mint(resurrectionPrompt);

    const monsterIds = await promptMonsters.getOwnerToTokenIds(userId);
    const monsterId = monsterIds[monsterIds.length - 1].toString();
    const stamina = ClientStamina.instance();
    const results2 = await Promise.all([
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      stamina.getStaminaLimit(),
    ]);
    const monsterContract = results2[0][0];
    setMonster((prevState) => {
      return prevState.copyWith({ id: monsterId });
    });
    return MonsterModel.fromContract(
      monsterId,
      monsterContract,
      Number(results2[1]),
    );
  };

  /**
   * Set monster
   */
  const set = (monster: MonsterModel): void => {
    setMonster(monster);
  };

  /**
   * Reset monster
   */
  const reset = (): void => {
    setMonster(MonsterModel.create({}));
  };

  /**
   * Fight monster
   * @param monsterId monster id
   * @param language output language
   * @param freePlay free play
   * @param userId user id
   */
  const fight = async (
    monsterId: MonsterId,
    language: string,
    resurrectionPrompt: string,
  ): Promise<string> => {
    let res: any;
    try {
      res = await axios.post("/api/fight-monster", {
        language,
        resurrectionPrompt,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response!.status === 500) return e.response!.data.battleResult;
        throw new Error(e.response!.data.message);
      }
      console.error(e);
      throw new Error("Unknown Error");
    }
    const battleResult = res.data.battleResult;
    if (monsterId === "") return battleResult;
    setMonster((prevState) => {
      return prevState.copyWith({ stamina: prevState.stamina - 1 });
    });
    return battleResult;
  };

  /**
   * Resurrect monster
   * @param resurrectionPrompt resurrection prompt
   */
  const resurrect = async (
    resurrectionPrompt: string,
  ): Promise<MonsterModel> => {
    const promptMonsters = ClientPromptMonsters.instance();
    const stamina = ClientStamina.instance();
    const monsterId = (
      await promptMonsters.getTokenIds([resurrectionPrompt])
    )[0];
    if (monsterId !== "0") throw new Error("This monster has already minted.");
    const results = await Promise.all([
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      stamina.getStaminaLimit(),
    ]);
    const resurrectedMonster = results[0][0];
    const staminaLimit = results[1];
    if (resurrectedMonster.name === "") throw new Error("Monster not found.");
    const newMonster = MonsterModel.fromContract(
      "",
      resurrectedMonster,
      Number(staminaLimit),
    );
    setMonster(newMonster);
    return newMonster;
  };

  /**
   * Restore stamina
   * @param monsterId monster id
   * @param restorePrice restore price
   */
  const restoreStamina = async (
    monsterId: MonsterId,
    restorePrice: number,
    userId: UserId,
  ): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const mchcoin = ClientMCHCoin.instance();
    const restoreStaminaPrice = ethers.utils.parseEther(
      restorePrice.toString(),
    );
    const results = await Promise.all([
      mchcoin.getBalanceOf(userId),
      mchcoin.getAllowance(userId, process.env.NEXT_PUBLIC_STAMINA_CONTRACT!),
    ]);
    const balanceOfMchc = results[0];
    if (balanceOfMchc.lt(restoreStaminaPrice))
      throw new Error("Insufficient balance of MCHC.");
    let allowance = results[1];
    if (allowance.lt(restoreStaminaPrice)) {
      await mchcoin.approve(
        process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
        restoreStaminaPrice,
      );
    }
    allowance = await mchcoin.getAllowance(
      userId,
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
    );
    if (allowance.lt(restoreStaminaPrice))
      throw new Error("Insufficient allowance of MCHC.");
    const stamina = ClientStamina.instance();
    const results2 = await Promise.all([
      stamina.restoreStamina(monsterId),
      stamina.getStaminaLimit(),
    ]);
    setMonster((prevState) => {
      return prevState.copyWith({ stamina: Number(results2[1]) });
    });
  };

  /**
   * Init monster
   */
  const init = async (): Promise<void> => {
    const selectedMonsterId = getCookie("SELECTED_MONSTER_ID");
    if (selectedMonsterId === "" || selectedMonsterId === undefined) return;

    const promptMonsters = ClientPromptMonsters.instance();
    const resurrectionPrompt = (
      await promptMonsters.getResurrectionPrompts([
        selectedMonsterId!.toString(),
      ])
    )[0];
    const stamina = ClientStamina.instance();
    const results = await Promise.all([
      promptMonsters.getMonsterExtensions([resurrectionPrompt]),
      stamina.getStaminaLimit(),
    ]);
    const monster = results[0][0];
    const staminaLimit = results[1];
    setMonster(MonsterModel.fromContract("", monster, Number(staminaLimit)));
  };

  const controller: MonsterController = {
    generate,
    mint,
    set,
    reset,
    fight,
    resurrect,
    restoreStamina,
    init,
  };
  return controller;
};

export const useMonsterState = (): [MonsterState, MonsterController] => [
  useMonsterValue(),
  useMonsterController(),
];
