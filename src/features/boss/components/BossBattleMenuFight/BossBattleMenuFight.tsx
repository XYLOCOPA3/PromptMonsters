import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { MAX_LIFE_POINT } from "@/const/bossBattle";
import { SKILL_TYPE_NAME } from "@/const/monster";
import { BossBattlePrevButton } from "@/features/boss/components/BossBattlePrevButton";
import { useBossValue } from "@/hooks/useBoss";
import {
  useBossBattleController,
  useBossBattleValue,
} from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import { EnumSkillType } from "@/types/EnumSkillType";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

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
  const language = useLanguageValue();
  const bossBattleController = useBossBattleController();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tCommon } = useTranslation("common");

  const handleSkill1Click = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.useSkill(
        monster.resurrectionPrompt,
        monster.skills[0],
        boss.skills,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
    }
    setDisable(false);
    setLoading(false);
  };

  const handleSkill2Click = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.useSkill(
        monster.resurrectionPrompt,
        monster.skills[1],
        boss.skills,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
    }
    setDisable(false);
    setLoading(false);
  };

  const handleSkill3Click = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.useSkill(
        monster.resurrectionPrompt,
        monster.skills[2],
        boss.skills,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
    }
    setDisable(false);
    setLoading(false);
  };

  const handleSkill4Click = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.useSkill(
        monster.resurrectionPrompt,
        monster.skills[3],
        boss.skills,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
    }
    setDisable(false);
    setLoading(false);
  };

  useLayoutEffectOfSSR(() => {
    if (monster.name !== "" && monster.skills.length === 0) {
      // TODO: スキルが1つもない場合の処理を書く
      return;
    }
  }, [monster]);

  if (boss.name === "" || language === "") return <></>;
  return (
    <>
      <div
        className={clsx(
          className,
          "flex",
          "my-[5px]",
          "flex-col",
          "w-[100%]",
          "h-[190px]",
          "md:h-[250px]",
        )}
      >
        <div className={clsx("flex", "w-[100%]", "h-[50%]", "mb-[5px]")}>
          {monster.skills.length >= 1 ? (
            <Skill
              className={clsx("mr-[5px]")}
              onClick={handleSkill1Click}
              skillName={monster.skills[0]}
              skillType={monster.skillTypes[0]}
              language={language}
              loading={loading}
              disable={disable}
            />
          ) : (
            <div className={clsx("w-1/2", "mr-[5px]")}></div>
          )}
          {monster.skills.length >= 2 ? (
            <Skill
              className={clsx("ml-[5px]")}
              onClick={handleSkill2Click}
              skillName={monster.skills[1]}
              skillType={monster.skillTypes[1]}
              language={language}
              loading={loading}
              disable={disable}
            />
          ) : (
            <div className={clsx("w-1/2", "ml-[5px]")}></div>
          )}
        </div>
        <div className={clsx("flex", "w-[100%]", "h-[50%]", "mt-[5px]")}>
          {monster.skills.length >= 3 ? (
            <Skill
              className={clsx("mr-[5px]")}
              onClick={handleSkill3Click}
              skillName={monster.skills[2]}
              skillType={monster.skillTypes[2]}
              language={language}
              loading={loading}
              disable={disable}
            />
          ) : (
            <div className={clsx("w-1/2", "mr-[5px]")}></div>
          )}
          {monster.skills.length >= 4 ? (
            <Skill
              className={clsx("ml-[5px]")}
              onClick={handleSkill4Click}
              skillName={monster.skills[3]}
              skillType={monster.skillTypes[3]}
              language={language}
              loading={loading}
              disable={disable}
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
const Skill = ({
  className,
  onClick,
  skillName,
  skillType,
  language,
  loading,
  disable,
}: any) => {
  const bossBattle = useBossBattleValue();

  return (
    <div
      className={clsx(
        className,
        "w-1/2",
        "font-bold",
        "bg-[#272727]/80",
        "p-[10px]",
        "rounded-lg",
        "border-[1px]",
        "text-center",
        "relative",
        bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
      )}
    >
      <Button
        variant="bossBattle"
        className={clsx("py-[10px]", "w-[100%]", "h-[100%]")}
        onClick={onClick}
        loading={loading}
        disabled={disable}
      >
        {skillName}
      </Button>
      <div
        className={clsx(
          "absolute",
          "top-[10px]",
          "left-[10px]",
          "font-normal",
          "text-[10px]",
          skillType === EnumSkillType.physicalAttack
            ? "text-[#f7a697]"
            : skillType === EnumSkillType.specialAttack
            ? "text-[#88d8ec]"
            : skillType === EnumSkillType.healing
            ? "text-[#9bf39b]"
            : "text-[#e9de9b]",
          "md:text-[12px]",
          "md:top-[15px]",
          "md:left-[15px]",
        )}
      >
        {SKILL_TYPE_NAME[language as "日本語" | "English"].get(skillType) ??
          "???"}
      </div>
    </div>
  );
};
