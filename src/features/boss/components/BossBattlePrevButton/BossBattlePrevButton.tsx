import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { FIRST_TURN } from "@/const/bossBattle";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

export type BossBattlePrevButtonProps = BaseProps;

/**
 * BossBattlePrevButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattlePrevButton = ({
  className,
}: BossBattlePrevButtonProps) => {
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);

  const { t: tBossBattle } = useTranslation("boss-battle");

  const popHistory = () => {
    if (bossBattle.turn === FIRST_TURN) {
      const length = bossBattle.histories.length;
      for (let i = 0; i < length; i++) {
        bossBattleController.popHistory();
      }
      return;
    }
    bossBattleController.popHistory();
  };

  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.moveStart();
      popHistory();
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
      disabled={disable}
    >
      {tBossBattle("prev")}
    </Button>
  );
};
