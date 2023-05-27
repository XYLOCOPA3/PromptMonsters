import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useBattleController } from "@/hooks/useBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterState } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

export type MonsterFightButtonProps = BaseProps;

/**
 * Monster fight button
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterFightButton = ({ className }: MonsterFightButtonProps) => {
  const language = useLanguageValue();
  const monsterMinted = useRecoilValue(monsterMintedState);
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const battleController = useBattleController();
  const { t: tMonsters } = useTranslation("monsters");

  /**
   * Click event
   */
  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    battleController.reset();
    try {
      const battleResult = await monsterController.fight(
        monster.id,
        language,
        monster.resurrectionPrompt,
      );
      battleController.set(battleResult);
    } catch (e) {
      console.error(e);
      alert(`Failed to fight.\n\nReason: ${e}`);
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
        monsterMinted ? "h-[62px]" : "h-[40px]",
        "max-w-[200px]",
      )}
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      {tMonsters("fight")}
      {monsterMinted ? (
        <div className={clsx("text-[12px]", "md:text-[16px]")}>
          {tMonsters("stamina")}: {monster.stamina} / 3
        </div>
      ) : (
        <></>
      )}
    </Button>
  );
};
