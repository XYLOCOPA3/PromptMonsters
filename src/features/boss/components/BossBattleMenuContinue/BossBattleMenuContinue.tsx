import { MAX_LIFE_POINT } from "@/const/bossBattle";
import { BossBattleNoButton, BossBattleYesButton } from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleMenuContinueProps = BaseProps;

/**
 * BossBattleMenuContinue
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuContinue = ({
  className,
}: BossBattleMenuContinueProps) => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  if (monster.name === "" || boss.name === "") return <></>;
  return (
    <>
      <div
        className={clsx(
          className,
          "flex",
          "mb-[5px]",
          "h-[140px]",
          "md:h-[250px]",
          "md:mb-[10px]",
        )}
      >
        <div
          className={clsx(
            "w-[100%]",
            "font-bold",
            "bg-[#272727]/80",
            "p-[10px]",
            "rounded-lg",
            "border-[1px]",
            bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
            "overflow-y-scroll",
          )}
        >
          <div className={clsx("whitespace-pre-wrap")}>
            {tBossBattle("continue")}
          </div>
        </div>
      </div>
      <div className={clsx("flex", "justify-between", "my-[5px]")}>
        <BossBattleNoButton className={clsx("w-1/4")} />
        <BossBattleYesButton className={clsx("w-1/4")} />
      </div>
    </>
  );
};
