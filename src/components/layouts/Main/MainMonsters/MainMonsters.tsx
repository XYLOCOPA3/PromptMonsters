import Image from "next/image";
import { Result } from "@/components/elements/Result";
import {
  BattleTweetButton,
  GenerateTweetButton,
  MonsterFightButton,
  MonsterFightText,
  MonsterGenerator,
  MonsterMintButton,
} from "@/features/monster";
import { monsterMintedState } from "@/stores/monsterMintedState";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

/**
 * Main: Monsters
 * @keit0728
 */
export const MainMonsters = () => {
  const monsterMinted = useRecoilValue(monsterMintedState);

  return (
    <>
      <div className={clsx("flex", "items-center", "flex-col", "mt-[100px]")}>
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
          <div className={clsx("flex", "w-[100%]")}>
            <div className={clsx("w-1/3")}></div>
            <div className={clsx("w-1/3", "flex", "justify-center")}>
              {monsterMinted ? <MonsterFightButton /> : <MonsterMintButton />}
            </div>
            <div className={clsx("w-1/3", "flex", "justify-end")}>
              <GenerateTweetButton />
            </div>
          </div>
          <MonsterFightText className={clsx("w-[100%]", "mt-[50px]")} />
          <div className={clsx("flex", "w-[100%]", "mt-[30px]")}>
            <div className={clsx("w-2/3")}></div>
            <div className={clsx("w-1/3", "flex", "justify-end")}>
              <BattleTweetButton />
            </div>
          </div>
        </div>
      </div>
      <Image
        className={clsx(
          "object-cover",
          "absolute",
          "top-0",
          "opacity-10",
          "h-[150%]",
          "z-[-1]",
        )}
        src="/assets/images/bg-arena.png"
        alt="bg-arena"
        width={4000}
        height={2000}
      />
    </>
  );
};
