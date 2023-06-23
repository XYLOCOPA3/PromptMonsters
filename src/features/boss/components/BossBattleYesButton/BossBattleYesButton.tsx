import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { ERROR_MAINTENANCE } from "@/const/error";
import { getTurnMsg } from "@/features/boss/utils/utils";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

export type BossBattleYesButtonProps = BaseProps;

/**
 * BossBattleYesButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleYesButton = ({
  className,
}: BossBattleYesButtonProps) => {
  const monster = useMonsterValue();
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");
  const { t: tCommon } = useTranslation("common");

  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.continueBossBattle(monster.resurrectionPrompt);
      bossBattleController.pushLog({ value: "", type: EnumBossBattleMsg.none });
      bossBattleController.pushLog({
        value: getTurnMsg(bossBattle.turn + 1, tBossBattle("turn")),
        type: EnumBossBattleMsg.none,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message !== ERROR_MAINTENANCE)
          alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      } else alert(tCommon("failedTx"));
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
      {tBossBattle("yes")}
    </Button>
  );
};
