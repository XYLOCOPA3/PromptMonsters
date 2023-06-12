import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/elements/Button";
import { useMonsterValue } from "@/hooks/useMonster";
import { BossBattleModel } from "@/models/BossBattleModel";
import { bossBattleState } from "@/stores/bossBattleState";
import { BaseProps } from "@/types/BaseProps";
import axios from "axios";
import clsx from "clsx";
import { useSetRecoilState } from "recoil";

export type DevBBResetButtonProps = BaseProps;

/**
 * DevBBResetButton
 * @keit0728
 * @param className Style from parent element
 */
export const DevBBResetButton = ({ className }: DevBBResetButtonProps) => {
  const monster = useMonsterValue();
  const setBossBattle = useSetRecoilState(bossBattleState);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await axios.post("/api/boss/dev/reset", {
      resurrectionPrompt: monster.resurrectionPrompt,
    });
    setBossBattle(BossBattleModel.create({}));
    setLoading(false);
    push("/boss");
  };

  return (
    <Button
      className={clsx(className, "m-[5px]", "p-[5px]")}
      onClick={handleClick}
      loading={loading}
    >
      BBリセット
    </Button>
  );
};
