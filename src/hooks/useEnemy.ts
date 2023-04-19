import { MonsterModel } from "@/models/MonsterModel";
import { EnemyState, enemyState } from "@/stores/enemyState";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface EnemyController {
  set: (feature: string, language: string) => Promise<void>;
}

export const useEnemyValue = (): EnemyState => {
  return useRecoilValue(enemyState);
};

export const useEnemyController = (): EnemyController => {
  const setEnemy = useSetRecoilState(enemyState);

  /**
   * Generate enemy
   * @param feature enemy feature
   * @param language output language
   */
  const set = async (feature: string, language: string): Promise<void> => {
    const res = await axios.post("/api/generate-enemy", {
      feature,
      language,
    });
    if (res.status !== 200) throw new Error(res.data.message);
    const content = res.data.result[0].message.content;
    const enemy = JSON.parse(content);
    if (enemy.isExisting)
      throw new Error("useEnemy.ts: This enemy is existing.");
    if (!enemy.isFiction)
      throw new Error("useEnemy.ts: This enemy is non fiction.");
    console.log(enemy);
    setEnemy(MonsterModel.fromData(feature, enemy));
  };

  const controller: EnemyController = {
    set,
  };
  return controller;
};

export const useEnemyState = (): [EnemyState, EnemyController] => [
  useEnemyValue(),
  useEnemyController(),
];
