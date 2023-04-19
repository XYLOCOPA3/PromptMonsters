import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useMonsterState } from "@/hooks/useMonster";
import { fightTextState } from "@/stores/fightTextState";
import { languageState } from "@/stores/languageState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue, useSetRecoilState } from "recoil";

export type MonsterFightButtonProps = BaseProps;

/**
 * Monster fight button
 * @feature
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterFightButton = ({ className }: MonsterFightButtonProps) => {
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const setFightText = useSetRecoilState(fightTextState);
  const language = useRecoilValue(languageState);

  /**
   * Click event
   */
  const handleClick = async () => {
    setLoading(true);
    try {
      const content = await monsterController.fight(monster, language);
      setFightText(content);
    } catch (e) {
      console.error(e);
      alert("Failed to fight.");
    }
    setLoading(false);
  };

  if (monster.name === "") return <></>;
  return (
    <Button
      disabled={loading}
      className={clsx("w-[100px]", "h-[40px]", "rounded-full", className)}
      loading={loading}
      onClick={handleClick}
    >
      FIGHT
    </Button>
  );
};
