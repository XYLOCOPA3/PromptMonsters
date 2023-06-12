import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useDevMonsterController } from "@/dev/hooks/useDevMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { useSetSelectedMonsterIdNameState } from "@/hooks/useSelectedMonsterIdName";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useSetRecoilState } from "recoil";

export type DevBBMonsterButtonProps = BaseProps;

/**
 * DevBBMonsterButton
 * @keit0728
 * @param className Style from parent element
 */
export const DevBBMonsterButton = ({ className }: DevBBMonsterButtonProps) => {
  const devMonsterController = useDevMonsterController();
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const [loading, setLoading] = useState(false);
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const setSelectedMonsterIdName = useSetSelectedMonsterIdNameState();

  const handleClick = async () => {
    setLoading(true);
    const newMonster = await devMonsterController.generate();
    const lastMonsterIndex = ownedMonsters.length - 1;
    if (lastMonsterIndex === -1) {
      ownedMonstersController.add(newMonster);
    } else {
      if (ownedMonsters[lastMonsterIndex].id !== "") {
        ownedMonstersController.add(newMonster);
      } else {
        ownedMonstersController.update(lastMonsterIndex, newMonster);
      }
    }
    setSelectedMonsterIdName(`${newMonster.name} | id: ${newMonster.id}`);
    setMonsterMinted(false);
    setLoading(false);
  };

  return (
    <Button
      className={clsx(className, "m-[5px]", "p-[5px]")}
      onClick={handleClick}
      loading={loading}
    >
      平均モンスター生成
    </Button>
  );
};
