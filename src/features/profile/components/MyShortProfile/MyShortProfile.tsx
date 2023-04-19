import Image from "next/image";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterController } from "@/hooks/useMonster";
import { useUserController, useUserValue } from "@/hooks/useUser";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
import { useSetRecoilState } from "recoil";
import { useAccount } from "wagmi";

export type MyShortProfileProps = BaseProps;

/**
 * Display user address and icon
 * @feature
 * @keit0728
 * @param className Style from parent element
 * @note Hidden when user is not logged in
 */
export const MyShortProfile = ({ className }: MyShortProfileProps) => {
  const user = useUserValue();
  const { address, isConnected } = useAccount();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const userController = useUserController();
  const monsterController = useMonsterController();
  const { open } = useWeb3Modal();

  /**
   * Login button click event
   */
  const handleClick = async () => {
    await open();
  };

  /**
   * Reset user info
   */
  const resetUserInfo = async () => {
    try {
      userController.reset();
      monsterController.reset();
      setMonsterMinted(false);
    } catch (e) {
      console.error(e);
      alert("Failed to login.\n\n" + e);
    }
  };

  useLayoutEffectOfSSR(() => {
    if (isConnected) return;
    resetUserInfo();
  }, [address]);

  if (user.id === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "flex",
        "items-center",
        "border-[1px]",
        "border-gray-800",
        "rounded-full",
        "select-none",
        "cursor-pointer",
      )}
      onClick={handleClick}
    >
      <Image
        className={clsx(
          "rounded-full",
          "w-[40px]",
          "h-[40px]",
          "bg-[#0d1117]",
          "border-[1px]",
          "border-gray-800",
          "mr-[10px]",
        )}
        src="/assets/images/prompt-monster-icon.svg"
        alt="userIcon"
        width={50}
        height={50}
      />
      <div className={clsx("w-[100px]", "truncate")}>{user.id}</div>
    </div>
  );
};
