import { Button } from "@/components/elements/Button";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleNoButtonProps = BaseProps;

/**
 * BossBattleNoButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleNoButton = ({ className }: BossBattleNoButtonProps) => {
  const [bossBattle, bossBattleController] = useBossBattleState();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleClick = async () => {
    await bossBattleController.moveEnd(bossBattle.lifePoint);
  };

  return (
    <Button
      className={clsx(className, "py-[10px]")}
      variant="secondary"
      onClick={handleClick}
    >
      {tBossBattle("no")}
    </Button>
  );
};
