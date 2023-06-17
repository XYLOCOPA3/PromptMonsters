import { useState } from "react";
import { ITEMS, MAX_LIFE_POINT, MIN_LIFE_POINT } from "@/const/bossBattle";
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
  getDefeatedMsg,
  getDefensedMsg,
  getDroppedItemMsg,
  getEscapeNextMsg,
  getItemUseResultMsg,
  getMonsterHealMsg,
  getMonsterOtherHealMsg,
  getMonsterOtherPhysicalAttack,
  getMonsterOtherPowerPhysicalAttack,
  getMonsterUsedSkillMsg,
  getUsedBossSubActionMsg,
  getUsedItemMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState, useBossBattleValue } from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { scoreOpenedState } from "@/stores/scoreOpenedState";
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
  const setScoreOpened = useSetRecoilState(scoreOpenedState);
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [loading, setLoading] = useState(false);
  const setDisable = useSetRecoilState(disableState);

  const handleNextClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      if (bossBattle.lp <= MIN_LIFE_POINT) setScoreOpened(true);
      else await bossBattleController.nextResultMsg();
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
      <div
        className={clsx(
          className,
          "flex",
          "mb-[5px]",
          "h-[140px]",
          "md:mb-[10px]",
          "md:h-[250px]",
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
    case EnumBossBattleMsg.monsterItemEscapeNext:
      return <MonsterItemEscapeNextMsg />;
    case EnumBossBattleMsg.bossOneHitKill:
      return <BossOneHitKillMsg />;
    case EnumBossBattleMsg.bossAttack:
      return <BossAttackMsg />;
    case EnumBossBattleMsg.bossPowerAttack:
      return <BossPowerAttackMsg />;
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
    case EnumBossBattleMsg.droppedItem:
      return <DroppedItemMsg />;
    case EnumBossBattleMsg.defeated:
      return <DefeatedMsg />;
    case EnumBossBattleMsg.bossSubAction:
      return <BossSubActionMsg />;
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
      <div className={clsx("whitespace-pre-wrap")}>
        {getMonsterOtherPhysicalAttack(
          monster.name,
          boss.name,
          bossBattle.usedMonsterSkill,
          tBossBattle("monsterOtherPhysicalAttack"),
        )}</div>
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
      <div className={clsx("whitespace-pre-wrap")}>
        {tBossBattle("monsterOtherSpecialAttack").replace("skillName", bossBattle.usedMonsterSkill)}
      </div>
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
      <div className={clsx("whitespace-pre-wrap")}>
        {getMonsterOtherPowerPhysicalAttack(
          monster.name,
          bossBattle.usedMonsterSkill,
          tBossBattle("monsterOtherPowerPhysicalAttack"),
        )}
      </div>
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
      <div className={clsx("whitespace-pre-wrap")}>
        {tBossBattle("monsterOtherPowerSpecialAttack").replace("skillName", bossBattle.usedMonsterSkill)}
      </div>
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
      <div className={clsx("whitespace-pre-wrap")}>
        {tBossBattle("monsterOtherDefense").replace("skillName", bossBattle.usedMonsterSkill)}
      </div>
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
      <div className={clsx("whitespace-pre-wrap")}>
        {getMonsterOtherHealMsg(monster.name, bossBattle.usedMonsterSkill, tBossBattle("monsterOtherHeal"))}
      </div>
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
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedOneHitKillSkill"),
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
    </>
  );
};

const BossAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedAttackSkill"),
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
    </>
  );
};

const BossPowerAttackMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedPowerAttackSkill"),
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
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <>
      {getBossUsedSkillMsg(
        boss.name,
        bossBattle.usedBossSkill,
        tBossBattle("bossUsedCounterAttackSkill"),
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
    </>
  );
};

const BossBuffMsg = () => {
  const boss = useBossValue();
  const monster = useMonsterValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <>
      {bossBattle.currentBossHit ? (
        <>
          {getBossUsedSkillMsg(
            boss.name,
            bossBattle.usedBossSkill,
            tBossBattle("bossUsedBuffSkill"),
          )}
          <br />
          {getBossBuffMsg(boss.name, tBossBattle("bossBuff"))}
        </>
      ) : (
        getBuffDebuffBossMissMsg(
          boss.name,
          monster.name,
          tBossBattle("bossBuffMiss"),
        )
      )}
    </>
  );
};

const BossDebuffMsg = () => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <>
      {bossBattle.currentBossHit ? (
        <>
          {getBossUsedSkillMsg(
            boss.name,
            bossBattle.usedBossSkill,
            tBossBattle("bossUsedDebuffSkill"),
          )}
          <br />
          {getBossDebuffMsg(monster.name, tBossBattle("bossDebuff"))}
        </>
      ) : (
        getBuffDebuffBossMissMsg(
          boss.name,
          monster.name,
          tBossBattle("bossDebuffMiss"),
        )
      )}
    </>
  );
};

const BossDefenseMsg = () => {
  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return <>{getBossDefensedMsg(boss.name, tBossBattle("bossDefensed"))}</>;
};

const DroppedItemMsg = () => {
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const language = useLanguageValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  if (bossBattle.droppedItemId === -1) return <></>;
  return (
    <>
      {getDroppedItemMsg(
        boss.name,
        ITEMS[language as "日本語" | "English"][bossBattle.droppedItemId].name,
        tBossBattle("droppedItem"),
      )}
    </>
  );
};

const DefeatedMsg = () => {
  const monster = useMonsterValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <div className={clsx("whitespace-pre-wrap")}>
      {getDefeatedMsg(monster.name, tBossBattle("defeated"))}
    </div>
  );
};

const MonsterItemEscapeNextMsg = () => {
  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <div className={clsx("whitespace-pre-wrap")}>
      {getEscapeNextMsg(boss.name, tBossBattle("escapeNext"))}
    </div>
  );
};

const BossSubActionMsg = () => {
  const boss = useBossValue();
  const { t: tBossBattle } = useTranslation("boss-battle");

  return (
    <div className={clsx("whitespace-pre-wrap")}>
      {getUsedBossSubActionMsg(boss.name, tBossBattle("usedBossSubAction"))}
    </div>
  );
};
