import { BossModel } from "@/models/BossModel";
import { BossState, bossState } from "@/stores/bossState";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface BossController {
  init: () => Promise<void>;
}

export const useBossValue = (): BossState => {
  return useRecoilValue(bossState);
};

export const useBossController = (): BossController => {
  const setBoss = useSetRecoilState(bossState);

  /**
   * Init boss
   */
  const init = async (): Promise<void> => {
    setBoss(
      BossModel.create({
        name: "ヨシュカ",
        flavor:
          "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。",
        imageURL: "/assets/images/boss-mch-yoshka.png",
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
