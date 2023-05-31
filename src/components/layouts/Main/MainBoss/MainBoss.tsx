import Link from "next/link";
import { Background } from "@/components/elements/Background";
import { Spinner } from "@/components/elements/Spinner";
import { BossBattleButton, BossImage, BossStatus } from "@/features/boss";
import {
  MonsterMintButton,
  MonsterSelector,
  ResurrectionPrompt,
} from "@/features/monster";
import { MonsterStatus } from "@/features/monster/components/MonsterStatus";
import { useBossValue } from "@/hooks/useBoss";
import { monsterMintedState } from "@/stores/monsterMintedState";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

/**
 * Main: Boss
 * @keit0728
 */
export const MainBoss = () => {
  const boss = useBossValue();
  const monsterMinted = useRecoilValue(monsterMintedState);
  const { t: tBoss } = useTranslation("boss");

  if (boss.name === "") {
    return (
      <>
        <Background
          className={clsx("opacity-30")}
          src="/assets/images/bg-boss-mch-yoshka.png"
        />
        <div className={clsx("flex", "items-center", "flex-col")}>
          <Spinner className={clsx("w-[50px]", "h-[50px]", "border-[4px]")} />
        </div>
      </>
    );
  }
  return (
    <>
      <Background
        className={clsx("opacity-30")}
        src="/assets/images/bg-boss-mch-yoshka.png"
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
          {tBoss("title")}
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
          href="https://www.notion.so/xylocopa/How-to-play-Boss-Battle-14cf1d63bcd04d9bb6e4f2cda1c81c7d?pvs=4"
          target="_blank"
        >
          {tBoss("howToPlay")}
        </Link>
        <div
          className={clsx(
            "mb-[30px]",
            "w-[90%]",
            "flex",
            "flex-col",
            "items-center",
          )}
        >
          <BossImage />
          <BossStatus />
        </div>
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
              <BossBattleButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};