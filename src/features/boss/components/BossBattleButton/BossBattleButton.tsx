import { useRouter } from "next/router";
import { Button } from "@/components/elements/Button";
import { useBossBattleController } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleButtonProps = BaseProps;

/**
 * Monster fight button
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleButton = ({ className }: BossBattleButtonProps) => {
  const monster = useMonsterValue();
  const bossBattleController = useBossBattleController();
  const { t: tBoss } = useTranslation("boss");
  const { push } = useRouter();

  /**
   * Click event
   */
  const handleClick = () => {
    bossBattleController.init();
    push("/boss/battle");
  };

  if (monster.name === "") return <></>;
  return (
    <Button
      className={clsx(
        className,
        "font-bold",
        "px-[30px]",
        "h-[50px]",
        "max-w-[200px]",
      )}
      variant="secondary"
      onClick={handleClick}
    >
      {tBoss("fight")}
    </Button>
  );
};
