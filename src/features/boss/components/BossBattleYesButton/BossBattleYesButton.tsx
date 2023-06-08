import { Button } from "@/components/elements/Button";
import { useBossBattleController } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleYesButtonProps = BaseProps;

/**
 * BossBattleYesButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleYesButton = ({
  className,
}: BossBattleYesButtonProps) => {
  const bossBattleController = useBossBattleController();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleClick = async () => {
    await bossBattleController.moveStart();
  };

  return (
    <Button
      className={clsx(className, "py-[10px]")}
      variant="secondary"
      onClick={handleClick}
    >
      {tBossBattle("yes")}
    </Button>
  );
};
