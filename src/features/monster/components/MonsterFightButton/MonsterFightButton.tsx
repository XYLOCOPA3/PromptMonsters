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
      disabled={disable || monster.stamina <= 0}
      className={clsx(
        className,
        "px-[20px]",
        "w-[100%]",
        "h-[62px]",
        "max-w-[200px]",
      )}
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      FIGHT
      <div className={clsx("text-[12px]", "md:text-[16px]")}>
        Stamina: {monster.stamina} / 3
      </div>
    </Button>
  );
};
