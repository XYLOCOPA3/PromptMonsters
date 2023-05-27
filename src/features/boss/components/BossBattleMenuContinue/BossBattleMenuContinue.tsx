import { BossBattleNoButton, BossBattleYesButton } from "@/features/boss";
import { getBossNextActionSignMsg } from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
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
  const language = useLanguageValue();
  const monster = useMonsterValue();
  const boss = useBossValue();
  const [bossBattle, bossBattleController] = useBossBattleState();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleNextClick = async () => {
    await bossBattleController.moveBossActionResult();
  };

  if (monster.name === "" || boss.name === "" || language === "") return <></>;
  return (
    <>
      <div className={clsx(className, "flex", "mb-[10px]", "h-[250px]")}>
        <div
          className={clsx(
            "w-[100%]",
            "font-bold",
            "bg-[#272727]",
            "p-[10px]",
            "rounded-lg",
            "border-[1px]",
          )}
        >
          {getBossNextActionSignMsg(
            bossBattle.bossNextActionSignIndex,
            language as "日本語" | "English",
            boss.name,
          )}
          <br />
          <br />
          {tBossBattle("continue")}
          <br />
          <br />
          <div className={clsx("whitespace-pre-wrap")}>
            {tBossBattle("continueNote")}
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
