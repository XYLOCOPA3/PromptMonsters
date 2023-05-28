import { MAX_STAMINA } from "@/const/monster";
import { RPC_URL } from "@/lib/wallet";
import { MonsterModel } from "@/models/MonsterModel";
import { MonsterState, monsterState } from "@/stores/monsterState";
import {
  MCHCoin__factory,
  PromptMonsters__factory,
  Stamina__factory,
} from "@/typechain";
import { FeatureErrorType } from "@/types/FeatureErrorType";
import { MonsterId } from "@/types/MonsterId";
import { UserId } from "@/types/UserId";
import { checkFeature, isSymbol } from "@/utils/validation";
import { fetchSigner } from "@wagmi/core";
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
   * @param userId user id
   * @param feature monster feature
   * @param language output language
   * @return {MonsterModel} MonsterModel
   */
  const generate = async (
    feature: string,
    language: string,
  ): Promise<MonsterModel> => {
    if (isSymbol(feature))
      throw new Error("Features must not contain numbers or symbols.");
    const result = checkFeature(feature);
    if (result !== FeatureErrorType.ok) {
      switch (result) {
        case FeatureErrorType.noFeature:
          throw new Error("Do not empty feature");
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
      if (axios.isAxiosError(e)) {
        throw new Error(e.response!.data.message);
      }
      console.error(e);
      throw new Error("Unknown Error");
    }
    if (res.status !== 200) throw new Error(res.data);
    const monsterJson = res.data.monster;
    const resurrectionPrompt = res.data.resurrectionPrompt;
    if (monsterJson.isExisting) throw new Error("This monster is existing.");
    if (!monsterJson.isFiction) throw new Error("This monster is non fiction.");
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );
    const monster = MonsterModel.fromData(
      monsterJson,
      feature,
      resurrectionPrompt,
      Number(await stamina.staminaLimit()),
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
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const mchcReader = MCHCoin__factory.connect(
      process.env.NEXT_PUBLIC_MCHCOIN_CONTRACT!,
      provider,
    );
    const monsterPrice = ethers.utils.parseEther("50");
    const balanceOfMchc = await mchcReader.balanceOf(userId);
    if (balanceOfMchc.lt(monsterPrice))
      throw new Error("Insufficient balance of MCHC.");
    const allowance = await mchcReader.allowance(
      userId,
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
    );
    if (allowance.lt(monsterPrice)) {
      const mchcWriter = MCHCoin__factory.connect(
        process.env.NEXT_PUBLIC_MCHCOIN_CONTRACT!,
        (await fetchSigner())!,
      );
      await (
        await mchcWriter.approve(
          process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
          monsterPrice,
        )
      ).wait();
    }
    const promptMonsters = PromptMonsters__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      (await fetchSigner())!,
    );
    await (await promptMonsters.mint(resurrectionPrompt)).wait();
    const monsterIds = await promptMonsters.getOwnerToTokenIds(userId);
    const monsterId = monsterIds[monsterIds.length - 1].toString();
    setMonster((prevState) => {
      return prevState.copyWith({ id: monsterId });
    });
    const monsterContract = (await promptMonsters.getMonsters([monsterId]))[0];
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );
    return MonsterModel.fromContract(
      monsterId,
      monsterContract,
      Number(await stamina.staminaLimit()),
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
        monsterId,
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
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const promptMonsters = PromptMonsters__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      provider,
    );
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );
    const results = await Promise.all([
      promptMonsters.getMonsterHistory(resurrectionPrompt),
      stamina.staminaLimit(),
    ]);
    const resurrectedMonster = results[0];
    const staminaLimit = results[1];
    if (resurrectedMonster.name === "") throw new Error("Monster not found.");
    const newMonster = MonsterModel.fromContract(
      "",
      resurrectedMonster,
      Number(staminaLimit),
      resurrectionPrompt,
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
    const mchcReader = MCHCoin__factory.connect(
      process.env.NEXT_PUBLIC_MCHCOIN_CONTRACT!,
      provider,
    );
    const restoreStaminaPrice = ethers.utils.parseEther(
      restorePrice.toString(),
    );
    const results = await Promise.all([
      mchcReader.balanceOf(userId),
      mchcReader.allowance(userId, process.env.NEXT_PUBLIC_STAMINA_CONTRACT!),
    ]);
    const balanceOfMchc = results[0];
    if (balanceOfMchc.lt(restoreStaminaPrice))
      throw new Error("Insufficient balance of MCHC.");
    let allowance = results[1];
    if (allowance.lt(restoreStaminaPrice)) {
      const mchcWriter = MCHCoin__factory.connect(
        process.env.NEXT_PUBLIC_MCHCOIN_CONTRACT!,
        (await fetchSigner())!,
      );
      await (
        await mchcWriter.approve(
          process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
          restoreStaminaPrice,
        )
      ).wait();
    }
    allowance = await mchcReader.allowance(
      userId,
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
    );
    if (allowance.lt(restoreStaminaPrice))
      throw new Error("Insufficient allowance of MCHC.");
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      (await fetchSigner())!,
    );
    await (await stamina.restoreStamina(monsterId)).wait();
    setMonster((prevState) => {
      return prevState.copyWith({ stamina: MAX_STAMINA });
    });
  };

  /**
   * Init monster
   */
  const init = async (): Promise<void> => {
    const selectedMonsterId = getCookie("SELECTED_MONSTER_ID");
    if (selectedMonsterId === "") return;

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const promptMonsters = PromptMonsters__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      provider,
    );
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );
    const results = await Promise.all([
      promptMonsters.getMonsters([Number(selectedMonsterId)]),
      stamina.staminaLimit(),
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
