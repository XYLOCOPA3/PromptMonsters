import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useBattleController } from "@/hooks/useBattle";
import { useMonsterState } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { languageState } from "@/stores/languageState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState, useRecoilValue } from "recoil";

export type MonsterFightButtonProps = BaseProps;

/**
 * Monster fight button
 * @feature
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterFightButton = ({ className }: MonsterFightButtonProps) => {
  const language = useRecoilValue(languageState);
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const battleController = useBattleController();

  /**
   * Click event
   */
  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    battleController.reset();
    try {
      const content = await monsterController.fight(monster.id, language);
      battleController.set(content);
    } catch (e) {
      console.error(e);
      alert("Failed to fight.");
    }
    setDisable(false);
    setLoading(false);
  };

  if (monster.name === "") return <></>;
  return (
    <Button
      disabled={disable}
      className={clsx("w-[100px]", "h-[40px]", "rounded-full", className)}
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      FIGHT
    </Button>
  );
};
