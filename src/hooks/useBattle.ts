import { BattleModel } from "@/models/BattleModel";
import { BattleState, battleState } from "@/stores/battleState";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface BattleController {
  set: (json: any) => void;
  reset: () => void;
}

export const useBattleValue = (): BattleState => {
  return useRecoilValue(battleState);
};

export const useBattleController = (): BattleController => {
  const setBattle = useSetRecoilState(battleState);

  /**
   * Set battle
   * @param json json
   */
  const set = (json: any): void => {
    setBattle(
      BattleModel.create({
        battleAnalysis: json.battleAnalysis,
        battleDescription: json.battleDescription,
        winnerId: json.winnerId,
      }),
    );
  };

  /**
   * Reset battle
   */
  const reset = (): void => {
    setBattle(BattleModel.create({}));
  };

  const controller: BattleController = {
    set,
    reset,
  };
  return controller;
};

export const useBattleState = (): [BattleState, BattleController] => [
  useBattleValue(),
  useBattleController(),
];
