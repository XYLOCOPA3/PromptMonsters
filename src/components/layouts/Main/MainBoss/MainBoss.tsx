import Link from "next/link";
import { useRouter } from "next/router";
import { Background } from "@/components/elements/Background";
import { Spinner } from "@/components/elements/Spinner";
import {
  BossBattleButton,
  BossBattleEndedText,
  BossImage,
  BossMintButton,
  BossMintResult,
  BossStatus,
} from "@/features/boss";
import {
  MonsterGenerator,
  MonsterMintButton,
  MonsterSelector,
  MonsterStatus,
  ResurrectionPrompt,
} from "@/features/monster";
import { useBossValue } from "@/hooks/useBoss";
import { bossBattleEndedState } from "@/stores/bossBattleEndedState";
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
  const bossBattleEnded = useRecoilValue(bossBattleEndedState);
  const { locale } = useRouter();
  const { t: tCommon } = useTranslation("common");
  const { t: tBoss } = useTranslation("boss");

  if (boss.name === "") {
    return (
      <>
        <Background
          className={clsx("opacity-30")}
          src="/assets/images/bg-boss-mch-yoshka.png"
        />
        <div
          className={clsx("flex", "justify-center", "items-center", "h-screen")}
        >
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
          href={
            locale === "ja"
              ? "https://xylocopa.notion.site/Boss-Battle-07781f9c428242e9b018eace0a036685?pvs=4"
              : "https://xylocopa.notion.site/English-How-to-play-Boss-Battle-dcb04db635fb4fa59983f52165d12fa1?pvs=4"
          }
          target="_blank"
        >
          {tCommon("howToPlay")}
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
          <div className={clsx("relative")}>
            <div
              className={clsx(
                "absolute",
                "inset-0",
                "text-center",
                "flex",
                "items-center",
                "justify-center",
              )}
            >
              <BossBattleEndedText className={clsx("w-[100%]")} />
            </div>
            <BossImage />
          </div>
          <BossStatus />
        </div>
        {bossBattleEnded ? (
          <>
            <BossMintResult className={clsx("w-[90%]", "mb-[30px]")} />
            <BossMintButton className={clsx("w-[90%]", "mb-[30px]")} />
          </>
        ) : (
          <>
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
              <div
                className={clsx("w-[100%]", "mb-[10px]", "flex", "justify-end")}
              >
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
                <div
                  className={clsx("w-[50%]", "flex", "items-end", "flex-col")}
                >
                  <BossBattleButton />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
