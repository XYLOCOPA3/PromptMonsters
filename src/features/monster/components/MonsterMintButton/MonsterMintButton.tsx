import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useMonsterState } from "@/hooks/useMonster";
import { useUserState } from "@/hooks/useUser";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { userInitState } from "@/stores/userInitState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue, useSetRecoilState } from "recoil";

export type MonsterMintButtonProps = BaseProps;

/**
 * Monster mint button
 * @feature
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterMintButton = ({ className }: MonsterMintButtonProps) => {
  const [user, userController] = useUserState();
  const [monster, monsterController] = useMonsterState();
  const userInit = useRecoilValue(userInitState);
  const [loading, setLoading] = useState(false);
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  /**
   * Click event
   */
  const handleClick = async () => {
    setLoading(true);
    try {
      if (user.id === "") await userController.login();
      await monsterController.mint(monster);
      setMonsterMinted(true);
    } catch (e) {
      console.error(e);
      alert("Failed to mint.");
    }
    setLoading(false);
  };

  if (monster.name === "") return <></>;
  return (
    <Button
      disabled={loading}
      className={clsx("w-[100px]", "h-[40px]", "rounded-full", className)}
      loading={loading || !userInit}
      onClick={handleClick}
    >
      MINT
    </Button>
  );
};
