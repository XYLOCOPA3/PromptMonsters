import { Background } from "@/components/elements/Background";
import { Spinner } from "@/components/elements/Spinner";
import { BossImage } from "@/features/boss";
import { BossBattleMenu } from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

/**
 * Main: BossBattle
 * @keit0728
 */
export const MainBossBattle = () => {
  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

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
      <div className={clsx("flex", "items-center", "flex-col", "mb-[10px]")}>
        <div className={clsx("max-w-[512px]", "mx-[10px]")}>
          <div
            className={clsx("mb-[30px]", "flex", "flex-col", "items-center")}
          >
            <BossImage />
          </div>
          <BossBattleMenu />
        </div>
      </div>
    </>
  );
};
