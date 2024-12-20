import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/elements/Button";
import { ERROR_MAINTENANCE } from "@/const/error";
import { useBossBattleController } from "@/hooks/useBossBattle";
import { useMonsterState } from "@/hooks/useMonster";
import { useOwnedMonstersController } from "@/hooks/useOwnedMonsters";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

export type BossBattleButtonProps = BaseProps;

/**
 * Monster fight button
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleButton = ({ className }: BossBattleButtonProps) => {
  const ownedMonstersController = useOwnedMonstersController();
  const bossBattleController = useBossBattleController();
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tCommon } = useTranslation("common");
  const { t: tBoss } = useTranslation("boss");
  const { push } = useRouter();

  /**
   * Click event
   */
  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      const skillTypes = await bossBattleController.init(monster);
      const newMonster = monster.copyWith({ skillTypes });
      monsterController.set(newMonster);
      ownedMonstersController.updateUsingRp(
        monster.resurrectionPrompt,
        newMonster,
      );
    } catch (error) {
      setLoading(false);
      setDisable(false);
      console.error(error);
      if (error instanceof Error) {
        if (error.message !== ERROR_MAINTENANCE)
          alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      } else alert(tCommon("failedTx"));
      return;
    }
    setDisable(false);
    setLoading(false);
    push("/boss/battle");
  };

  if (monster === undefined) return <></>;
  if (monster.name === "") return <></>;
  return (
    <Button
      className={clsx(className, "font-bold", "h-[50px]", "w-[100px]")}
      disabled={disable}
      loading={loading}
      variant="secondary"
      onClick={handleClick}
    >
      {tBoss("fight")}
    </Button>
  );
};
