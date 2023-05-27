import { Button } from "@/components/elements/Button";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleUseButtonProps = BaseProps;

/**
 * BossBattleUseButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleUseButton = ({
  className,
}: BossBattleUseButtonProps) => {
  const [bossBattle, bossBattleController] = useBossBattleState();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleClick = async () => {
    await bossBattleController.useItem(bossBattle.setItemId);
  };

  return (
    <Button
      className={clsx(className, "py-[10px]")}
      variant="secondary"
      onClick={handleClick}
      disabled={!bossBattle.itemIds.includes(bossBattle.setItemId)}
    >
      {tBossBattle("use")}
    </Button>
  );
};
