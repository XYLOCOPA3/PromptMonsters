import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { mchVerseTestnet } from "@/const/chainParams";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterController } from "@/hooks/useMonster";
import { useUserController } from "@/hooks/useUser";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { userInitState } from "@/stores/userInitState";
import { BaseProps } from "@/types/BaseProps";
import { switchNetwork } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useAccount, useNetwork } from "wagmi";

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
  const { address, isConnected } = useAccount();
  const { open, setDefaultChain } = useWeb3Modal();
  const { chain } = useNetwork();
  const userController = useUserController();
  const monsterController = useMonsterController();

  /**
   * Login button click event
   */
  const handleClick = async () => {
    setLoading(true);
    await open();
    setDefaultChain(mchVerseTestnet);
    setLoading(false);
  };

  /**
   * Set user info
   */
  const setUserInfo = async () => {
    try {
      if (chain!.id !== mchVerseTestnet.id)
        switchNetwork({ chainId: mchVerseTestnet.id });
      await userController.set(address!);
      const isSet = await monsterController.set(address!);
      setMonsterMinted(isSet);
    } catch (e) {
      console.error(e);
      alert("Failed to login.\n\n" + e);
    }
  };

  useLayoutEffectOfSSR(() => {
    if (!isConnected) return;
    setUserInfo();
  }, [address]);

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
      loading={loading || !userInit}
      onClick={handleClick}
    >
      LOGIN
    </Button>
  );
};
