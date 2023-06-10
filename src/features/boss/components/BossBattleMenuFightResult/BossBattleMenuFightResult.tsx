import { BossBattleNextButton } from "@/features/boss";
import {
  getBossDamageMsg,
  getMonsterUsedSkillMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleMenuFightResultProps = BaseProps;

/**
 * BossBattleMenuFightResult
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuFightResult = ({
  className,
}: BossBattleMenuFightResultProps) => {
  const monster = useMonsterValue();
  const [bossBattle, bossBattleController] = useBossBattleState();

  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const handleNextClick = async () => {
    await bossBattleController.moveBossActionResult();
  };

  if (boss.name === "") return <></>;
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
          {getMonsterUsedSkillMsg(
            monster.name,
            bossBattle.usedMonsterSkill,
            tBossBattle("monsterUsedSkill"),
          )}
          <br />
          {getBossDamageMsg(
            monster.name,
            bossBattle.currentBossDamage,
            boss.name,
            tBossBattle("bossDamage"),
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
