import { useState } from "react";
import { ITEMS } from "@/const/bossBattle";
import { BossBattleNextButton } from "@/features/boss";
import {
  getBossBuffMsg,
  getBossDamageMsg,
  getBossDamagedMsg,
  getBossDebuffMsg,
  getBossDefensedMsg,
  getBossPreCounterAttackMsg,
  getBossUsedSkillMsg,
  getBuffDebuffBossMissMsg,
  getDefensedMsg,
  getDroppedItemMsg,
  getItemUseResultMsg,
  getMonsterHealMsg,
  getMonsterOtherHealMsg,
  getMonsterOtherPhysicalAttack,
  getMonsterOtherPowerPhysicalAttack,
  getMonsterUsedSkillMsg,
  getUsedItemMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import {
  useBossBattleController,
  useBossBattleValue,
} from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

export type BossBattleMenuResultProps = BaseProps;

/**
 * BossBattleMenuResult
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuResult = ({
  className,
}: BossBattleMenuResultProps) => {
  const boss = useBossValue();
  const bossBattleController = useBossBattleController();
  const [loading, setLoading] = useState(false);
  const setDisable = useSetRecoilState(disableState);

  const handleNextClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.nextResultMsg();
    } catch (error) {
      console.error(error);
      // TODO: エラー文考える
      if (error instanceof Error) alert("Error\n\nReason: " + error.message);
      else alert("Error");
    }
    setDisable(false);
    setLoading(false);
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
          <ResultMsg />
        </div>
      </div>
      <div className={clsx("flex", "justify-end", "my-[5px]")}>
        <BossBattleNextButton
          className={clsx("w-1/4")}
          onClick={handleNextClick}
          loading={loading}
        />
      </div>
    </>
  );
};

const ResultMsg = () => {
  const bossBattle = useBossBattleValue();
  console.log(bossBattle.resultMsgIds);
  switch (bossBattle.resultMsgIds[bossBattle.resultMsgIds.length - 1]) {
    case EnumBossBattleMsg.monsterFightPhysicalAttack:
    case EnumBossBattleMsg.monsterFightSpecialAttack:
      return <MonsterFightAttackMsg />;
    case EnumBossBattleMsg.monsterFightHeal:
      return <MonsterFightHealMsg />;
    case EnumBossBattleMsg.monsterFightOtherPhysicalAttack:
      return <MonsterFightOtherPhysicalAttackMsg />;
    case EnumBossBattleMsg.monsterFightOtherSpecialAttack:
      return <MonsterFightOtherSpecialAttackMsg />;
    case EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack:
      return <MonsterFightOtherPowerPhysicalAttackMsg />;
    case EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack:
      return <MonsterFightOtherPowerSpecialAttackMsg />;
    case EnumBossBattleMsg.monsterFightOtherDefense:
      return <MonsterFightOtherDefenseMsg />;
    case EnumBossBattleMsg.monsterFightOtherHeal:
      return <MonsterFightOtherHealMsg />;
    case EnumBossBattleMsg.monsterDefense:
      return <MonsterDefenseMsg />;
    case EnumBossBattleMsg.monsterItemBuff:
    case EnumBossBattleMsg.monsterItemDebuff:
    case EnumBossBattleMsg.monsterItemHeal:
    case EnumBossBattleMsg.monsterItemEscape:
      return <MonsterItemMsg />;
    case EnumBossBattleMsg.bossOneHitKill:
      return <BossOneHitKillMsg />;
    case EnumBossBattleMsg.bossAttack:
    case EnumBossBattleMsg.bossPowerAttack:
      return <BossAttackMsg />;
    case EnumBossBattleMsg.bossPreCounterAttack:
      return <BossPreCounterAttackMsg />;
    case EnumBossBattleMsg.bossCounterAttack:
      return <BossCounterAttackMsg />;
    case EnumBossBattleMsg.bossBuff:
      return <BossBuffMsg />;
    case EnumBossBattleMsg.bossDebuff:
      return <BossDebuffMsg />;
    case EnumBossBattleMsg.bossDefense:
      return <BossDefenseMsg />;
    default:
      return <></>;
  }
};

const MonsterFightAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {bossBattle.currentMonsterHit
        ? getBossDamageMsg(
            monster.name,
            bossBattle.currentBossDamage,
            boss.name,
            tBossBattle("bossDamage"),
          )
        : tBossBattle("monsterMiss")}
    </>
  );
};

const MonsterFightHealMsg = () => {
  const monster = useMonsterValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {getMonsterHealMsg(
        monster.name,
        bossBattle.currentHealing,
        tBossBattle("monsterHeal"),
      )}
    </>
  );
};

const MonsterFightOtherPhysicalAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {getMonsterOtherPhysicalAttack(
        monster.name,
        boss.name,
        tBossBattle("monsterOtherPhysicalAttack"),
      )}
      <br />
      {bossBattle.currentMonsterHit
        ? getBossDamageMsg(
            monster.name,
            bossBattle.currentBossDamage,
            boss.name,
            tBossBattle("bossDamage"),
          )
        : tBossBattle("monsterMiss")}
    </>
  );
};

const MonsterFightOtherSpecialAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {tBossBattle("monsterOtherSpecialAttack")}
      <br />
      {bossBattle.currentMonsterHit
        ? getBossDamageMsg(
            monster.name,
            bossBattle.currentBossDamage,
            boss.name,
            tBossBattle("bossDamage"),
          )
        : tBossBattle("monsterMiss")}
    </>
  );
};

const MonsterFightOtherPowerPhysicalAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {getMonsterOtherPowerPhysicalAttack(
        monster.name,
        tBossBattle("monsterOtherPowerPhysicalAttack"),
      )}
      <br />
      {bossBattle.currentMonsterHit
        ? getBossDamageMsg(
            monster.name,
            bossBattle.currentBossDamage,
            boss.name,
            tBossBattle("bossDamage"),
          )
        : tBossBattle("monsterMiss")}
    </>
  );
};

const MonsterFightOtherPowerSpecialAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {tBossBattle("monsterOtherPowerSpecialAttack")}
      <br />
      {bossBattle.currentMonsterHit
        ? getBossDamageMsg(
            monster.name,
            bossBattle.currentBossDamage,
            boss.name,
            tBossBattle("bossDamage"),
          )
        : tBossBattle("monsterMiss")}
    </>
  );
};

const MonsterFightOtherDefenseMsg = () => {
  const monster = useMonsterValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {tBossBattle("monsterOtherDefense")}
    </>
  );
};

const MonsterFightOtherHealMsg = () => {
  const monster = useMonsterValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getMonsterUsedSkillMsg(
        monster.name,
        bossBattle.usedMonsterSkill,
        tBossBattle("monsterUsedSkill"),
      )}
      <br />
      {getMonsterOtherHealMsg(monster.name, tBossBattle("monsterOtherHeal"))}
    </>
  );
};

const MonsterDefenseMsg = () => {
  const monster = useMonsterValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return <>{getDefensedMsg(monster.name, tBossBattle("defensed"))} </>;
};

const MonsterItemMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getUsedItemMsg(
        monster.name,
        ITEMS[language as "日本語" | "English"][bossBattle.usedItemId].name,
        tBossBattle("usedItem"),
      )}
      <br />
      {getItemUseResultMsg(
        monster.name,
        boss.name,
        ITEMS[language as "日本語" | "English"][bossBattle.usedItemId].result,
      )}
    </>
  );
};

const BossOneHitKillMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedSkill"),
      )}
      <br />
      {bossBattle.currentBossHit
        ? getBossDamagedMsg(
            boss.name,
            bossBattle.currentMonsterDamage,
            monster.name,
            tBossBattle("monsterDamage"),
          )
        : tBossBattle("bossMiss")}
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
    </>
  );
};

const BossAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedSkill"),
      )}
      <br />
      {bossBattle.currentBossHit
        ? getBossDamagedMsg(
            boss.name,
            bossBattle.currentMonsterDamage,
            monster.name,
            tBossBattle("monsterDamage"),
          )
        : tBossBattle("bossMiss")}
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
    </>
  );
};

const BossPreCounterAttackMsg = () => {
  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getBossPreCounterAttackMsg(
        boss.name,
        tBossBattle("bossPreCounterAttack"),
      )}
    </>
  );
};

const BossCounterAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedSkill"),
      )}
      <br />
      {bossBattle.currentBossHit
        ? getBossDamagedMsg(
            boss.name,
            bossBattle.currentMonsterDamage,
            monster.name,
            tBossBattle("monsterDamage"),
          )
        : tBossBattle("bossMiss")}
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
    </>
  );
};

const BossBuffMsg = () => {
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {bossBattle.currentBossHit ? (
        <>
          {getBossUsedSkillMsg(
            boss.name,
            bossBattle.usedBossSkill,
            tBossBattle("bossUsedSkill"),
          )}
          <br />
          {getBossBuffMsg(boss.name, tBossBattle("bossBuff"))}
        </>
      ) : (
        getBuffDebuffBossMissMsg(boss.name, tBossBattle("bossBuffDebuffMiss"))
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
    </>
  );
};

const BossDebuffMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {bossBattle.currentBossHit ? (
        <>
          {getBossUsedSkillMsg(
            boss.name,
            bossBattle.usedBossSkill,
            tBossBattle("bossUsedSkill"),
          )}
          <br />
          {getBossDebuffMsg(monster.name, tBossBattle("bossDebuff"))}
        </>
      ) : (
        getBuffDebuffBossMissMsg(boss.name, tBossBattle("bossBuffDebuffMiss"))
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
    </>
  );
};

const BossDefenseMsg = () => {
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <>
      {getBossDefensedMsg(boss.name, tBossBattle("bossDefensed"))}
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
    </>
  );
};
