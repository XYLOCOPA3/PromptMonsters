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
 * Main: Monsters
 * @layout
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
          {monsterMinted ? <MonsterFightButton /> : <MonsterMintButton />}
          <MonsterFightText className={clsx("w-[100%]", "mt-[50px]")} />
        </div>
      </div>
      <Image
        className={clsx(
          "object-cover",
          "absolute",
          "top-0",
          "opacity-10",
          "h-[100%]",
          "z-[-1]",
        )}
        src="/assets/images/bg-arena.jpg"
        alt="bg-arena"
        width={4000}
        height={2000}
      />
      <Image
        className={clsx(
          "object-cover",
          "absolute",
          "top-[100%]",
          "opacity-10",
          "h-[100%]",
          "z-[-1]",
        )}
        src="/assets/images/bg-arena.jpg"
        alt="bg-arena"
        width={4000}
        height={2000}
      />
    </>
  );
};
