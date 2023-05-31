import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/elements/Button";
import { useBossBattleController } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
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
  const monster = useMonsterValue();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const bossBattleController = useBossBattleController();
  const { t: tBoss } = useTranslation("boss");
  const { push } = useRouter();

  /**
   * Click event
   */
  const handleClick = async () => {
    setDisable(true);
    setLoading(true);
    await bossBattleController.init(monster.id);
    push("/boss/battle");
    setDisable(false);
    setLoading(false);
  };

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