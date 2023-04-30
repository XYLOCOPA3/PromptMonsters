import { ListBox } from "@/components/elements/ListBox";
import { useBattleController } from "@/hooks/useBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterController, useMonsterValue } from "@/hooks/useMonster";
import { useOwnedMonstersValue } from "@/hooks/useOwnedMonsters";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { selectedMonsterIdNameState } from "@/stores/selectedMonsterIdNameState";
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
  const [selectedMonsterIdName, setSelectedMonsterIdName] = useRecoilState(
    selectedMonsterIdNameState,
  );
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  useLayoutEffectOfSSR(() => {
    setSelectedMonsterIdName(
      `${ownedMonsters[0].name} | id: ${ownedMonsters[0].id}`,
    );
  }, []);

  useLayoutEffectOfSSR(() => {
    if (selectedMonsterIdName === "") return;
    const selectedMonster = ownedMonsters.filter(
      (monster) =>
        `${monster.name} | id: ${monster.id}` === selectedMonsterIdName,
    )[0];
    monsterController.set(selectedMonster);
    battleController.reset();
    if (monster.id === "") {
      setMonsterMinted(false);
      return;
    }
    setMonsterMinted(true);
  }, [selectedMonsterIdName]);

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
      selected={selectedMonsterIdName}
      setSelected={setSelectedMonsterIdName}
      list={ownedMonsters.map(
        (monster) => `${monster.name} | id: ${monster.id}`,
      )}
    />
  );
};
