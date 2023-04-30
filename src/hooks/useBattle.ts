import { BattleModel } from "@/models/BattleModel";
import { BattleState, battleState } from "@/stores/battleState";
import { parseJson } from "@/utils/jsonParser";
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
    console.log(json);
    const battleResult = parseJson(json);
    console.log(battleResult);
    setBattle(
      BattleModel.create({
        language: battleResult.language,
        battleDesc: battleResult.battleDesc,
        enemyName: battleResult.enemyName,
        winnerId: battleResult.winnerId,
        winnerName: battleResult.winnerName,
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
