import { MAX_STAMINA } from "@/const/monster";
import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { ClientMCHCoin } from "@/features/mchcoin/api/contracts/ClientMCHCoin";
import { ClientPromptMonsters } from "@/features/monster/api/contracts/ClientPromptMonsters";
import { BossModel } from "@/models/BossModel";
import { MonsterModel } from "@/models/MonsterModel";
import { BossState, bossState } from "@/stores/bossState";
import { MonsterId } from "@/types/MonsterId";
import { UserId } from "@/types/UserId";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface BossController {
  init: (language: string) => Promise<void>;
  mint: (
    language: string,
    monsterIds: MonsterId[],
    userId: UserId,
  ) => Promise<MonsterModel>;
}

export const useBossValue = (): BossState => {
  return useRecoilValue(bossState);
};

export const useBossController = (): BossController => {
  const setBoss = useSetRecoilState(bossState);
  const { t: tBoss } = useTranslation("boss");

  /**
   * Init boss
   */
  const init = async (language: string): Promise<void> => {
    const bossBattle = await ClientBossBattle.instance();
    const boss = await bossBattle.getBossExtension(language);
    setBoss(
      BossModel.create({
        feature: boss.feature,
        name: boss.name,
        flavor: boss.flavor,
        skills: boss.skills,
        lv: boss.lv,
        status: {
          HP: boss.hp,
          ATK: boss.atk,
          DEF: boss.def,
          INT: boss.inte,
          MGR: boss.mgr,
          AGL: boss.agl,
        },
        imageURL: "/assets/images/boss-mch-yoshka.png",
        skillTypes: boss.skillTypes,
      }),
    );
  };

  /**
   * Mint boss
   */
  const mint = async (
    language: string,
    resurrectionPrompts: string[],
    userId: UserId,
  ): Promise<MonsterModel> => {
    const bossBattle = await ClientBossBattle.instance();
    const mintable = await bossBattle.getMintable(userId);
    console.log(mintable);
    if (!mintable) {
      // MCHC支払い処理
      const mchcoin = ClientMCHCoin.instance();
      const results = await Promise.all([
        bossBattle.getHighScores(resurrectionPrompts),
        mchcoin.getBalanceOf(userId),
        mchcoin.getAllowance(
          userId,
          process.env.NEXT_PUBLIC_BOSS_BATTLE_CONTRACT!,
        ),
        bossBattle.getMintPrice(),
      ]);
      const highScores = results[0];
      const balanceOfMchc = results[1];
      const allowance = results[2];
      const mintPrice = results[3];
      let mintable = false;
      for (let i = 0; i < highScores.length; i++) {
        if (highScores[i] !== 0) {
          mintable = true;
          break;
        }
      }
      if (!mintable) throw new Error(`${tBoss("notMintable")}`);
      if (balanceOfMchc.lt(mintPrice))
        throw new Error("Insufficient balance of MCHC.");
      if (allowance.lt(mintPrice)) {
        await mchcoin.approve(
          process.env.NEXT_PUBLIC_BOSS_BATTLE_CONTRACT!,
          mintPrice,
        );
      }
      await bossBattle.changeMintable();
    }

    // ボスモンスターミント
    let res: any;
    try {
      res = await axios.post("/api/boss/generate-boss", {
        language,
        userId,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) throw new Error(e.response!.data.message);
      console.error(e);
      throw new Error("Unknown Error");
    }
    const newMonster = res.data.monsterExtension;
    const imageURL = res.data.imageURL;
    console.log(newMonster);
    console.log(imageURL);

    const promptMonsters = ClientPromptMonsters.instance();
    const monsterId = (
      await promptMonsters.getTokenIds([newMonster.resurrectionPrompt])
    )[0];

    return MonsterModel.fromContract(
      monsterId,
      newMonster,
      MAX_STAMINA,
      imageURL,
    );
  };

  const controller: BossController = {
    init,
    mint,
  };
  return controller;
};

export const useBossState = (): [BossState, BossController] => [
  useBossValue(),
  useBossController(),
];
