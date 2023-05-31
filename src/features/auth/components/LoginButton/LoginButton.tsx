import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { mchVerse } from "@/const/chainParams";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterState } from "@/hooks/useMonster";
import { useUserController } from "@/hooks/useUser";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
import { useSetRecoilState } from "recoil";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

export type LoginButtonProps = BaseProps;

/**
 * Login button
 * @keit0728
 * @param className Style from parent element
 */
export const LoginButton = ({ className }: LoginButtonProps) => {
  const { chain } = useNetwork();
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { open, setDefaultChain } = useWeb3Modal();
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const userController = useUserController();
  const { switchNetwork } = useSwitchNetwork();

  /**
   * Login button click event
   */
  const handleClick = async () => {
    setLoading(true);
    await open();
    setLoading(false);
  };

  /**
   * Set user info
   */
  const setUserInfo = async () => {
    if (!isConnected) return;
    try {
      setDefaultChain(mchVerse);
      if (chain!.id !== mchVerse.id) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (switchNetwork !== undefined) switchNetwork!(mchVerse.id);
      }
      userController.set(address!, false);
      const isSet = await monsterController.init(address!, monster);
      setMonsterMinted(isSet);
    } catch (e) {
      console.error(e);
      alert("Failed to login.\n\n" + e);
    }
  };

  useLayoutEffectOfSSR(() => {
    setUserInfo();
  }, [address, switchNetwork]);

  return (
    <Button
      disabled={loading}
      className={clsx(
        className,
        "w-[60px]",
        "h-[25px]",
        "text-[10px]",
        "rounded-[100px]",
        "font-bold",
        "md:w-[100px]",
        "md:h-[35px]",
        "md:text-[15px]",
      )}
      loading={loading}
      onClick={handleClick}
    >
      LOGIN
    </Button>
  );
};
