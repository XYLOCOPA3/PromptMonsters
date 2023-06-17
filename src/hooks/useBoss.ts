import { ClientBossBattle } from "@/features/boss/api/contracts/ClientBossBattle";
import { BossModel } from "@/models/BossModel";
import { BossState, bossState } from "@/stores/bossState";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface BossController {
  init: (language: string) => Promise<void>;
}

export const useBossValue = (): BossState => {
  return useRecoilValue(bossState);
};

export const useBossController = (): BossController => {
  const setBoss = useSetRecoilState(bossState);

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

  const controller: BossController = {
    init,
  };
  return controller;
};

export const useBossState = (): [BossState, BossController] => [
  useBossValue(),
  useBossController(),
];
