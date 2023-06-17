import Link from "next/link";
import { useRouter } from "next/router";
import { Background } from "@/components/elements/Background";
import {
  BattleTweetButton,
  GenerateTweetButton,
  MonsterFightButton,
  MonsterFightText,
  MonsterGenerator,
  MonsterMintButton,
  MonsterSelector,
  MonsterStatus,
  ResurrectionPrompt,
} from "@/features/monster";
import { RestoreStaminaButton, StaminaTimer } from "@/features/stamina";
import { monsterMintedState } from "@/stores/monsterMintedState";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

/**
 * Main: Monsters
 * @keit0728
 */
export const MainMonsters = () => {
  const monsterMinted = useRecoilValue(monsterMintedState);
  const { t: tCommon } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <>
      <Background
        className={clsx("opacity-10")}
        src="/assets/images/bg-arena.png"
      />
      <div
        className={clsx(
          "flex",
          "items-center",
          "flex-col",
          "mt-[80px]",
          "md:mt-[100px]",
        )}
      >
        <div className={clsx("font-bold", "text-[28px]", "md:text-[50px]")}>
          BATTLE
        </div>
        <Link
          className={clsx(
            "font-bold",
            "text-[16px]",
            "text-blue-500",
            "hover:underline",
            "mb-[40px]",
            "md:text-[20px]",
          )}
          href={
            locale === "ja"
              ? "https://www.notion.so/xylocopa/Monster-Generator-25cd0f553bb648b29ebac04567389cc7?pvs=4"
              : "https://www.notion.so/xylocopa/English-How-to-play-Monster-Generator-f37dbaa2e363406a8606a8824465d57f?pvs=4"
          }
          target="_blank"
        >
          {tCommon("howToPlay")}
        </Link>
        <MonsterGenerator className={clsx("my-[20px]", "w-[300px]")} />
        <div>or</div>
        <ResurrectionPrompt className={clsx("my-[20px]", "w-[300px]")} />
        <div
          className={clsx(
            "w-[90%]",
            "mb-[20px]",
            "max-w-[512px]",
            "flex",
            "flex-col",
            "items-center",
          )}
        >
          <div className={clsx("w-[100%]", "mb-[10px]", "flex", "justify-end")}>
            <MonsterSelector className={clsx("w-[50%]")} />
          </div>
          <MonsterStatus className={clsx("w-[100%]", "mb-[10px]")} />
          <div className={clsx("w-[100%]", "mb-[20px]", "flex", "justify-end")}>
            <GenerateTweetButton />
          </div>
          <div className={clsx("flex", "w-[100%]")}>
            <div
              className={clsx(
                "w-[50%]",
                "flex",
                "flex-col",
                "items-start",
                "justify-end",
                "select-none",
              )}
            >
              {monsterMinted ? <></> : <MonsterMintButton />}
            </div>
            <div className={clsx("w-[50%]", "flex", "items-end", "flex-col")}>
              <MonsterFightButton />
              {monsterMinted ? (
                <StaminaTimer className={clsx("mt-[5px]")} />
              ) : (
                <></>
              )}
              <RestoreStaminaButton className={clsx("mt-[5px]")} />
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
    </>
  );
};
