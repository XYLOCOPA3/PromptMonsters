import { RPC_URL } from "@/lib/wallet";
import { MonsterModel } from "@/models/MonsterModel";
import { MonsterState, monsterState } from "@/stores/monsterState";
import { MCHCoin__factory, PromptMonsters__factory } from "@/typechain";
import { MonsterId } from "@/types/MonsterId";
import { UserId } from "@/types/UserId";
import { isNumOrSymbol } from "@/utils/validation";
import { fetchSigner } from "@wagmi/core";
import axios from "axios";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface MonsterController {
  generate: (
    userId: UserId,
    feature: string,
    language: string,
  ) => Promise<void>;
  mint: (userId: UserId, monster: MonsterModel) => Promise<void>;
  set: (userId: UserId) => Promise<boolean>;
  reset: () => void;
  fight: (monsterId: MonsterId, language: string) => Promise<string>;
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
   */
  const generate = async (
    userId: UserId,
    feature: string,
    language: string,
  ): Promise<void> => {
    if (isNumOrSymbol(feature))
      throw new Error("Features must not contain numbers or symbols.");
    const res = await axios.post("/api/generate-monster", {
      userId,
      feature,
      language,
    });
    if (res.status !== 200) throw new Error(res.data.message);
    const monster = res.data.monster;
    console.log(monster);
    if (monster.isExisting) throw new Error("This monster is existing.");
    if (!monster.isFiction) throw new Error("This monster is non fiction.");
    setMonster(MonsterModel.fromData(feature, monster));
  };

  /**
   * Mint monster
   * @param userId user id
   * @param monster monster model
   */
  const mint = async (userId: UserId, monster: MonsterModel): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(
      RPC_URL.mchVerseTestnet,
    );
    const mchcReader = MCHCoin__factory.connect(
      process.env.NEXT_PUBLIC_MCHCOIN_CONTRACT!,
      provider,
    );
    const monsterPrice = ethers.utils.parseEther("100");
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
    await (await promptMonsters.mint()).wait();
    const id = (
      Number(await promptMonsters.getMonstersTotalSupply()) - 1
    ).toString();
    setMonster((prevState) => {
      return prevState.copyWith({ id });
    });
  };

  /**
   * Set monster
   * @param userId user id
   */
  const set = async (userId: UserId): Promise<boolean> => {
    const provider = new ethers.providers.JsonRpcProvider(
      RPC_URL.mchVerseTestnet,
    );
    const promptMonsters = PromptMonsters__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
      provider,
    );
    const tokenIds = await promptMonsters.getOwnerToTokenIds(userId);
    if (tokenIds.length === 0) return false;
    const monsters = await promptMonsters.getMonsters(tokenIds);
    setMonster(
      MonsterModel.create({
        id: tokenIds[0].toString(),
        name: monsters[0].name,
        flavor: monsters[0].flavor,
        skills: monsters[0].skills,
        lv: Number(monsters[0].lv),
        status: {
          HP: Number(monsters[0].hp),
          ATK: Number(monsters[0].atk),
          DEF: Number(monsters[0].def),
          INT: Number(monsters[0].inte),
          MGR: Number(monsters[0].mgr),
          AGL: Number(monsters[0].agl),
        },
      }),
    );
    return true;
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
   */
  const fight = async (
    monsterId: MonsterId,
    language: string,
  ): Promise<string> => {
    const res = await axios.post("/api/fight-monster", {
      monsterId,
      language,
    });
    const content = res.data.result[0].message.content;
    return content;
  };

  const controller: MonsterController = {
    generate,
    mint,
    set,
    reset,
    fight,
  };
  return controller;
};

export const useMonsterState = (): [MonsterState, MonsterController] => [
  useMonsterValue(),
  useMonsterController(),
];
