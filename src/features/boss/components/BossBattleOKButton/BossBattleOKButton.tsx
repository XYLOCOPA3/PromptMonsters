import { Button } from "@/components/elements/Button";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleOKButtonProps = {
  onClick?: () => void;
} & BaseProps;

/**
 * BossBattleOKButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleOKButton = ({
  className,
  onClick,
}: BossBattleOKButtonProps) => {
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <Button
      className={clsx(className, "py-[10px]")}
      variant="secondary"
      onClick={onClick}
    >
      {tBossBattle("ok")}
    </Button>
  );
};
