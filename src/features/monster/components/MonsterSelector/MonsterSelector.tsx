import { ListBox } from "@/components/elements/ListBox";
import { useBattleController } from "@/hooks/useBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterController, useMonsterValue } from "@/hooks/useMonster";
import { useOwnedMonstersValue } from "@/hooks/useOwnedMonsters";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { selectedMonsterNameState } from "@/stores/selectedMonsterNameState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState, useSetRecoilState } from "recoil";

export type MonsterSelectorProps = BaseProps;

/**
 * MonsterSelector
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterSelector = ({ className }: MonsterSelectorProps) => {
  const monster = useMonsterValue();
  const ownedMonsters = useOwnedMonstersValue();
  const [selectedMonsterName, setSelectedMonsterName] = useRecoilState(
    selectedMonsterNameState,
  );
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  useLayoutEffectOfSSR(() => {
    setSelectedMonsterName(ownedMonsters[0].name);
  }, []);

  useLayoutEffectOfSSR(() => {
    if (selectedMonsterName === "") return;
    const selectedMonster = ownedMonsters.filter(
      (monster) => monster.name === selectedMonsterName,
    )[0];
    monsterController.set(selectedMonster);
    battleController.reset();
    if (monster.id === "") {
      setMonsterMinted(false);
      return;
    }
    setMonsterMinted(true);
  }, [selectedMonsterName]);

  useLayoutEffectOfSSR(() => {
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
      selected={selectedMonsterName}
      setSelected={setSelectedMonsterName}
      list={ownedMonsters.map((monster) => monster.name)}
    />
  );
};
