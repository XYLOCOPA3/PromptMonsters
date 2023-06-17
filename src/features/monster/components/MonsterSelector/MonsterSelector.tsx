import { ListBox } from "@/components/elements/ListBox";
import { useBattleController } from "@/hooks/useBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterController, useMonsterValue } from "@/hooks/useMonster";
import { useOwnedMonstersValue } from "@/hooks/useOwnedMonsters";
import { useSelectedMonsterIdNameState } from "@/hooks/useSelectedMonsterIdName";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { ownedMonstersInitState } from "@/stores/ownedMonstersInitState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { getCookie } from "cookies-next";
import { useRecoilValue, useSetRecoilState } from "recoil";

export type MonsterSelectorProps = BaseProps;

/**
 * MonsterSelector
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterSelector = ({ className }: MonsterSelectorProps) => {
  const monster = useMonsterValue();
  const ownedMonsters = useOwnedMonstersValue();
  const ownedMonstersInit = useRecoilValue(ownedMonstersInitState);
  const [selectedMonsterIdName, setSelectedMonsterIdName] =
    useSelectedMonsterIdNameState();
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  useLayoutEffectOfSSR(() => {
    if (ownedMonsters.length === 0 || !ownedMonstersInit) return;
    const selectedMonsterId = getCookie("SELECTED_MONSTER_ID");
    if (selectedMonsterId === undefined) {
      setSelectedMonsterIdName(
        `${ownedMonsters[0].name} | id: ${ownedMonsters[0].id}`,
      );
      return;
    }
    for (let i = 0; i < ownedMonsters.length; i++) {
      if (ownedMonsters[i].id === selectedMonsterId) {
        setSelectedMonsterIdName(
          `${ownedMonsters[i].name} | id: ${ownedMonsters[i].id}`,
        );
        return;
      }
    }
    setSelectedMonsterIdName(
      `${ownedMonsters[0].name} | id: ${ownedMonsters[0].id}`,
    );
  }, [ownedMonstersInit]);

  useLayoutEffectOfSSR(() => {
    if (selectedMonsterIdName === "") return;
    const selectedMonster = ownedMonsters.filter(
      (monster) =>
        `${monster.name} | id: ${monster.id}` === selectedMonsterIdName,
    )[0];
    monsterController.set(selectedMonster);
    battleController.reset();
    if (monster === undefined) return;
    if (monster.id === "") {
      setMonsterMinted(false);
      return;
    }
    setMonsterMinted(true);
  }, [selectedMonsterIdName]);

  useLayoutEffectOfSSR(() => {
    if (monster === undefined) return;
    if (monster.id === "") {
      setMonsterMinted(false);
      return;
    }
    setMonsterMinted(true);
  }, [monster]);

  if (ownedMonsters.length === 0) return <></>;
  return (
    <ListBox
      className={clsx(className)}
      selected={selectedMonsterIdName}
      setSelected={setSelectedMonsterIdName}
      list={ownedMonsters.map(
        (monster) => `${monster.name} | id: ${monster.id}`,
      )}
    />
  );
};
