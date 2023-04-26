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
   * Click event
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
        "rounded-full",
        "select-none",
        "cursor-pointer",
        "bg-[#171718]",
      )}
      onClick={handleClick}
    >
      <Image
        className={clsx(
          "rounded-full",
          "w-[30px]",
          "h-[30px]",
          "border-[1px]",
          "border-gray-700",
          "mr-[10px]",
          "md:w-[40px]",
          "md:h-[40px]",
        )}
        src="/assets/images/monster-icon.jpg"
        alt="monster-icon"
        width={300}
        height={300}
      />
      <div
        className={clsx(
          "w-[50px]",
          "truncate",
          "text-[8px]",
          "md:text-[15px]",
          "md:w-[100px]",
        )}
      >
        {user.id}
      </div>
    </div>
  );
};
