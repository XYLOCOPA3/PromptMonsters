import { ClientPromptMonstersContract } from "@/features/monster/api/contracts";
import { MonsterModel } from "@/models/MonsterModel";
import { MonsterState, monsterState } from "@/stores/monsterState";
import { UserId } from "@/types/UserId";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface MonsterController {
  generate: (feature: string, language: string) => Promise<void>;
  mint: (monster: MonsterModel) => Promise<void>;
  set: (userId: UserId) => Promise<boolean>;
  fight: (monster: MonsterModel, language: string) => Promise<string>;
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
   */
  const generate = async (feature: string, language: string): Promise<void> => {
    const res = await axios.post("/api/generate-monster", {
      feature,
      language,
    });
    if (res.status !== 200) throw new Error(res.data.message);
    const content = res.data.result[0].message.content;
    const monster = JSON.parse(content);
    if (monster.isExisting)
      throw new Error("useMonster.ts: This monster is existing.");
    if (!monster.isFiction)
      throw new Error("useMonster.ts: This monster is non fiction.");
    setMonster(MonsterModel.fromData(feature, monster));
  };

  /**
   * Mint monster
   * @param monster monster model
   */
  const mint = async (monster: MonsterModel): Promise<void> => {
    const promptMonsters = await ClientPromptMonstersContract.instance();
    await promptMonsters.mint(monster);
    const id = ((await promptMonsters.getMonstersTotalSupply()) - 1).toString();
    setMonster((prevState) => {
      return prevState.copyWith({ id });
    });
  };

  /**
   * Set monster
   * @param monster monster model
   */
  const set = async (userId: UserId): Promise<boolean> => {
    const promptMonsters = await ClientPromptMonstersContract.instance();
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
   * Fight monster
   * @param monster monster model
   * @param language output language
   */
  const fight = async (
    monster: MonsterModel,
    language: string,
  ): Promise<string> => {
    const promptMonsters = await ClientPromptMonstersContract.instance();
    const totalSupply = await promptMonsters.getMonstersTotalSupply();
    if (totalSupply < 1) throw new Error("useMonster.ts: No monsters.");
    let random: number;
    while (true) {
      random = Math.floor(Math.random() * totalSupply);
      if (random !== Number(monster.id)) break;
    }
    const enemies = await promptMonsters.getMonsters([BigInt(random)]);
    if (enemies.length === 0) throw new Error("useMonster.ts: No enemies.");
    const enemy = MonsterModel.create({
      id: random.toString(),
      name: enemies[0].name,
      flavor: enemies[0].flavor,
      skills: enemies[0].skills,
      lv: Number(enemies[0].lv),
      status: {
        HP: Number(enemies[0].hp),
        ATK: Number(enemies[0].atk),
        DEF: Number(enemies[0].def),
        INT: Number(enemies[0].inte),
        MGR: Number(enemies[0].mgr),
        AGL: Number(enemies[0].agl),
      },
    });
    const res = await axios.post("/api/fight-monster", {
      monster,
      enemy,
      language,
    });
    const content = res.data.result[0].message.content;
    return content;
  };

  const controller: MonsterController = {
    generate,
    mint,
    set,
    fight,
  };
  return controller;
};

export const useMonsterState = (): [MonsterState, MonsterController] => [
  useMonsterValue(),
  useMonsterController(),
];
