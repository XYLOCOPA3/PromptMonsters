import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useBossBattleController } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { scoreOpenedState } from "@/stores/scoreOpenedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";

export type BossBattleNoButtonProps = BaseProps;

/**
 * BossBattleNoButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleNoButton = ({ className }: BossBattleNoButtonProps) => {
  const monster = useMonsterValue();
  const bossBattleController = useBossBattleController();
  const setScoreOpened = useSetRecoilState(scoreOpenedState);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");
  const { t: tCommon } = useTranslation("common");

  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.end(monster.resurrectionPrompt);
      setScoreOpened(true);
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
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
      {tBossBattle("no")}
    </Button>
  );
};
