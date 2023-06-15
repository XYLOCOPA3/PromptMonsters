import { useRouter } from "next/router";
import { Background } from "@/components/elements/Background";
import { Spinner } from "@/components/elements/Spinner";
import { BossAdjCircle, BossImage } from "@/features/boss";
import { BossBattleMenu } from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

/**
 * Main: BossBattle
 * @keit0728
 */
export const MainBossBattle = () => {
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();

  const { push } = useRouter();
  const { t: tBossBattle } = useTranslation("boss-battle");

  useLayoutEffectOfSSR(() => {
    if (!bossBattle.bossBattleStarted) {
      alert(tBossBattle("invalidStarted"));
      push("/boss");
    }
  }, []);

  if (boss.name === "" || !bossBattle.bossBattleStarted) {
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
      <div className={clsx("flex", "items-center", "flex-col", "mb-[10px]")}>
        <div className={clsx("max-w-[512px]", "w-[90%]", "mx-[10px]")}>
          <div
            className={clsx(
              "mb-[30px]",
              "flex",
              "flex-col",
              "items-center",
              "relative",
            )}
          >
            <BossAdjCircle />
            <BossImage />
          </div>
          <BossBattleMenu />
        </div>
      </div>
    </>
  );
};
