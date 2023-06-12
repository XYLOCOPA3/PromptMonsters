import { Button } from "@/components/elements/Button";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

export type BossBattleNextButtonProps = {
  loading?: boolean;
  onClick?: () => void;
} & BaseProps;

/**
 * BossBattleNextButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleNextButton = ({
  className,
  loading = false,
  onClick,
}: BossBattleNextButtonProps) => {
  const disable = useRecoilValue(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <Button
      className={clsx(className, "py-[10px]")}
      variant="secondary"
      onClick={onClick}
      loading={loading}
      disabled={disable}
    >
      {tBossBattle("next")}
    </Button>
  );
};
