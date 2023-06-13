import { MAX_STAMINA } from "@/const/monster";
import { MonsterModel } from "@/models/MonsterModel";
import { MonsterState, monsterState } from "@/stores/monsterState";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface DevMonsterController {
  generate: () => Promise<MonsterModel>;
}

export const useDevMonsterValue = (): MonsterState => {
  return useRecoilValue(monsterState);
};

export const useDevMonsterController = (): DevMonsterController => {
  const setMonster = useSetRecoilState(monsterState);

  /**
   * Generate monster
   * @return {MonsterModel} MonsterModel
   */
  const generate = async (): Promise<MonsterModel> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/dev/generate-monster", {});
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
    const feature = res.data.feature;
    const monster = MonsterModel.fromData(
      monsterJson,
      feature,
      resurrectionPrompt,
      MAX_STAMINA,
    );
    setMonster(monster);
    return monster;
  };

  const controller: DevMonsterController = {
    generate,
  };
  return controller;
};

export const useDevMonsterState = (): [MonsterState, DevMonsterController] => [
  useDevMonsterValue(),
  useDevMonsterController(),
];
