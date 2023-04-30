import Image from "next/image";
import { Result } from "@/components/elements/Result";
import { TwitterIcon } from "@/features/lp";
import {
  BattleTweetButton,
  GenerateTweetButton,
  MonsterFightButton,
  MonsterFightText,
  MonsterGenerator,
  MonsterMintButton,
  MonsterSelector,
  ResurrectionPrompt,
} from "@/features/monster";
import { PlayNote } from "@/features/note";
import { StaminaTimer } from "@/features/stamina";
import { useOwnedMonstersValue } from "@/hooks/useOwnedMonsters";
import { monsterMintedState } from "@/stores/monsterMintedState";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

/**
 * Main: Monsters
 * @keit0728
 */
export const MainMonsters = () => {
  const monsterMinted = useRecoilValue(monsterMintedState);
  const ownedMonsters = useOwnedMonstersValue();

  return (
    <>
      <TwitterIcon />
      <div
        className={clsx(
          "flex",
          "items-center",
          "flex-col",
          "mt-[100px]",
          ownedMonsters.length === 0 ? "h-[150%]" : "",
        )}
      >
        <div
          className={clsx(
            "w-[90%]",
            "mb-[30px]",
            "max-w-[700px]",
            "flex",
            "flex-col",
            "items-center",
          )}
        >
          <PlayNote className={clsx("w-[100%]")} />
        </div>
        <MonsterGenerator className={clsx("my-[20px]", "w-[300px]")} />
        <div>or</div>
        <ResurrectionPrompt className={clsx("my-[20px]", "w-[300px]")} />
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
          {ownedMonsters.length === 0 ? (
            <></>
          ) : (
            <div
              className={clsx("w-[100%]", "mb-[10px]", "flex", "justify-end")}
            >
              <MonsterSelector className={clsx("w-[50%]")} />
            </div>
          )}
          <Result className={clsx("w-[100%]", "mb-[10px]")} />
          <div className={clsx("w-[100%]", "mb-[20px]", "flex", "justify-end")}>
            <GenerateTweetButton />
          </div>
          <div className={clsx("flex", "w-[100%]")}>
            <div className={clsx("w-[50%]", "flex", "items-start", "flex-col")}>
              {monsterMinted ? <></> : <MonsterMintButton />}
            </div>
            <div className={clsx("w-[50%]", "flex", "items-end", "flex-col")}>
              <MonsterFightButton />
              {monsterMinted ? (
                <StaminaTimer className={clsx("mt-[5px]")} />
              ) : (
                <></>
              )}
            </div>
          </div>
          <MonsterFightText className={clsx("w-[100%]", "mt-[40px]")} />
          <div className={clsx("flex", "w-[100%]", "mt-[10px]")}>
            <div className={clsx("w-2/3", "select-none")}></div>
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
          "h-[300%]",
          "z-[-1]",
          "md:h-[200%]",
        )}
        src="/assets/images/bg-arena.png"
        alt="bg-arena"
        width={4000}
        height={2000}
      />
    </>
  );
};
