import { ITEMS } from "@/const/bossBattle";
import { BossBattleNextButton } from "@/features/boss";
import {
  getItemUseResultMsg,
  getUsedItemMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleMenuItemResultProps = BaseProps;

/**
 * BossBattleMenuItemResult
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuItemResult = ({
  className,
}: BossBattleMenuItemResultProps) => {
  const language = useLanguageValue();
  const monster = useMonsterValue();
  const [bossBattle, bossBattleController] = useBossBattleState();

  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleNextClick = async () => {
    await bossBattleController.moveBossActionResult();
  };

  if (boss.name === "" || language === "") return <></>;
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
          {getUsedItemMsg(
            monster.name,
            ITEMS[language as "日本語" | "English"][bossBattle.usedItemId].name,
            tBossBattle("usedItem"),
          )}
          <br />
          {getItemUseResultMsg(
            monster.name,
            boss.name,
            ITEMS[language as "日本語" | "English"][bossBattle.usedItemId]
              .result,
          )}
        </div>
      </div>
      <div className={clsx("flex", "justify-end", "my-[5px]")}>
        <BossBattleNextButton
          className={clsx("w-1/4")}
          onClick={handleNextClick}
        />
      </div>
    </>
  );
};
