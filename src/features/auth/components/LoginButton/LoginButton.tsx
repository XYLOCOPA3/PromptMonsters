import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useMonsterController } from "@/hooks/useMonster";
import { useUserController } from "@/hooks/useUser";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { userInitState } from "@/stores/userInitState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue, useSetRecoilState } from "recoil";

export type LoginButtonProps = BaseProps;

/**
 * Login button
 * @feature
 * @keit0728
 * @param className Style from parent element
 */
export const LoginButton = ({ className }: LoginButtonProps) => {
  const userInit = useRecoilValue(userInitState);
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const [loading, setLoading] = useState(false);
  const userController = useUserController();
  const monsterController = useMonsterController();

  /**
   * Login button click event
   */
  const handleClick = async () => {
    setLoading(true);
    try {
      const userId = await userController.login();
      const isSet = await monsterController.set(userId);
      setMonsterMinted(isSet);
    } catch (e) {
      console.error(e);
      alert("Failed to login.");
    }
    setLoading(false);
  };

  return (
    <Button
      disabled={loading}
      className={clsx("w-[100px]", "h-[40px]", "rounded-full", className)}
      loading={loading || !userInit}
      onClick={handleClick}
    >
      LOGIN
    </Button>
  );
};
