import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { mchVerse } from "@/const/chainParams";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useUserController } from "@/hooks/useUser";
import { BaseProps } from "@/types/BaseProps";
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
// import { isSet } from "util/types";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

export type LoginButtonProps = BaseProps;

/**
 * Login button
 * @keit0728
 * @param className Style from parent element
 */
export const LoginButton = ({ className }: LoginButtonProps) => {
  const userController = useUserController();
  const [loading, setLoading] = useState(false);

  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { open, setDefaultChain } = useWeb3Modal();
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
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      LOGIN
    </Button>
  );
};
