import Image from "next/image";
import { Result } from "@/components/elements/Result";
import { MonsterGenerator } from "@/features/monster";
import { MonsterFightButton } from "@/features/monster/components/MonsterFightButton";
import { MonsterFightText } from "@/features/monster/components/MonsterFightText";
import { MonsterMintButton } from "@/features/monster/components/MonsterMintButton";
import { monsterMintedState } from "@/stores/monsterMintedState";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

/**
 * Main: Home
 * @layout
 * @keit0728
 */
export const MainHome = () => {
  const monsterMinted = useRecoilValue(monsterMintedState);

  return (
    <>
      <div className={clsx("flex", "items-center", "flex-col")}>
        <MonsterGenerator className={clsx("my-[20px]", "w-[300px]")} />
        <div
          className={clsx(
            "w-[90%]",
            "mb-[20px]",
            "max-w-[700px]",
            "flex",
            "flex-col",
            "items-center",
          )}
        >
          <Result className={clsx("w-[100%]", "mb-[30px]")} />
          {monsterMinted ? <MonsterFightButton /> : <MonsterMintButton />}
          <MonsterFightText className={clsx("w-[100%]", "mt-[50px]")} />
        </div>
      </div>
      <Image
        className={clsx(
          "rounded-full",
          "w-[512px]",
          "h-[512px]",
          "bg-[#0d1117]",
          "border-[1px]",
          "border-gray-800",
          "z-[-1]",
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "opacity-10",
        )}
        src="assets/images/background.svg"
        alt="userIcon"
        width={512}
        height={512}
      />
    </>
  );
};
