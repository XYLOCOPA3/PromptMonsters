import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

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
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.useItem(bossBattle.setItemId);
    } catch (error) {
      console.error(error);
      // TODO: エラー文考える
      if (error instanceof Error) alert("Error\n\nReason: " + error.message);
      else alert("Error");
    }
    setDisable(false);
    setLoading(false);
  };

  return (
    <Button
      className={clsx(className, "py-[10px]")}
      variant="secondary"
      onClick={handleClick}
      loading={loading}
      disabled={!bossBattle.itemIds.includes(bossBattle.setItemId) || disable}
    >
      {tBossBattle("use")}
    </Button>
  );
};
