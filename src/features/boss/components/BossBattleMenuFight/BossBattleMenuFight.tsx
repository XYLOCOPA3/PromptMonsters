import { Button } from "@/components/elements/Button";
import { BossBattlePrevButton } from "@/features/boss/components/BossBattlePrevButton";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleController } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { monsterInitState } from "@/stores/monsterInitState";
import { BaseProps } from "@/types/BaseProps";
import { BossBattlePhase } from "@/types/BossBattlePhase";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

export type BossBattleMenuFightProps = BaseProps;

/**
 * BossBattleMenuFight
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuFight = ({
  className,
}: BossBattleMenuFightProps) => {
  const boss = useBossValue();
  const monster = useMonsterValue();
  const monsterInit = useRecoilValue(monsterInitState);
  const bossBattleController = useBossBattleController();

  const handleSkill1Click = async () => {
    await bossBattleController.attack(monster.skills[0]);
  };

  const handleSkill2Click = async () => {
    await bossBattleController.attack(monster.skills[1]);
  };

  const handleSkill3Click = async () => {
    await bossBattleController.attack(monster.skills[2]);
  };

  const handleSkill4Click = async () => {
    await bossBattleController.attack(monster.skills[3]);
  };

  useLayoutEffectOfSSR(() => {
    if (!monsterInit) return;
    if (monster.name !== "" && monster.skills.length === 0) {
      bossBattleController.changePhase(BossBattlePhase.fightResult);
      return;
    }
  }, [monsterInit]);

  if (boss.name === "" || !monsterInit) return <></>;
  return (
    <>
      <div
        className={clsx(className, "flex", "my-[5px]", "h-[250px]", "flex-col")}
      >
        <div className={clsx("flex", "h-[50%]", "mb-[5px]")}>
          {monster.skills.length >= 1 ? (
            <Skill
              className={clsx("mr-[5px]")}
              onClick={handleSkill1Click}
              skillName={monster.skills[0]}
            />
          ) : (
            <div className={clsx("w-1/2", "mr-[5px]")}></div>
          )}
          {monster.skills.length >= 2 ? (
            <Skill
              className={clsx("ml-[5px]")}
              onClick={handleSkill2Click}
              skillName={monster.skills[1]}
            />
          ) : (
            <div className={clsx("w-1/2", "ml-[5px]")}></div>
          )}
        </div>
        <div className={clsx("flex", "h-[50%]", "mt-[5px]")}>
          {monster.skills.length >= 3 ? (
            <Skill
              className={clsx("mr-[5px]")}
              onClick={handleSkill3Click}
              skillName={monster.skills[2]}
            />
          ) : (
            <div className={clsx("w-1/2", "mr-[5px]")}></div>
          )}
          {monster.skills.length >= 4 ? (
            <Skill
              className={clsx("ml-[5px]")}
              onClick={handleSkill4Click}
              skillName={monster.skills[3]}
            />
          ) : (
            <div className={clsx("w-1/2", "ml-[5px]")}></div>
          )}
        </div>
      </div>
      <BossBattlePrevButton className={clsx("w-1/4", "my-[5px]")} />
    </>
  );
};

/**
 * Boss battle score
 * @param score score
 */
const Skill = ({ className, onClick, skillName }: any) => {
  return (
    <div
      className={clsx(
        className,
        "w-1/2",
        "font-bold",
        "bg-[#272727]",
        "p-[10px]",
        "rounded-lg",
        "border-[1px]",
        "text-center",
        "relative",
      )}
    >
      <Button
        variant="bossBattle"
        className={clsx("py-[10px]", "w-[100%]", "h-[100%]")}
        onClick={onClick}
      >
        {skillName}
      </Button>
      <div
        className={clsx(
          "absolute",
          "top-[15px]",
          "left-[15px]",
          "font-normal",
          "text-[12px]",
        )}
      >
        物理攻撃
      </div>
    </div>
  );
};
