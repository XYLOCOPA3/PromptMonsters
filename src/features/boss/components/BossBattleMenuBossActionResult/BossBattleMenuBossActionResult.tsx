import { ITEMS } from "@/const/bossBattle";
import { BossBattleNextButton } from "@/features/boss";
import {
  getBossDamagedMsg,
  getBossUsedSkillMsg,
  getDroppedItemMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleMenuBossActionResultProps = BaseProps;

/**
 * BossBattleMenuBossActionResult
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuBossActionResult = ({
  className,
}: BossBattleMenuBossActionResultProps) => {
  const language = useLanguageValue();
  const monster = useMonsterValue();
  const boss = useBossValue();
  const [bossBattle, bossBattleController] = useBossBattleState();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleNextClick = async () => {
    await bossBattleController.moveContinue();
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
          {getBossUsedSkillMsg(
            boss.name,
            bossBattle.usedBossSkill,
            tBossBattle("bossUsedSkill"),
          )}
          <br />
          {getBossDamagedMsg(
            boss.name,
            bossBattle.currentMonsterDamage,
            monster.name,
            tBossBattle("monsterDamage"),
          )}
          <br />
          <br />
          {bossBattle.droppedItemId === -1 ? (
            <></>
          ) : (
            getDroppedItemMsg(
              boss.name,
              ITEMS[language as "日本語" | "English"][bossBattle.droppedItemId]
                .name,
              tBossBattle("droppedItem"),
            )
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
