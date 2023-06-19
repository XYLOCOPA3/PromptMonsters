import { BossBattleMenu } from "@/features/boss/components/BossBattleMenu/BossBattleMenu";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import clsx from "clsx";

export type BossBattleMenuAnimationProps = BaseProps;

/**
 * BossBattleMenuAnimation
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuAnimation = ({
  className,
}: BossBattleMenuAnimationProps) => {
  const bossBattle = useBossBattleValue();

  const lastIndex = bossBattle.resultMsgIds.length - 1;
  return (
    <div
      className={clsx(
        className,
        _isBossAttack(
          bossBattle.resultMsgIds[lastIndex],
          bossBattle.currentBossHit,
          bossBattle.currentMonsterDamage,
        )
          ? "animate-shake-horizontal"
          : "",
      )}
    >
      <BossBattleMenu />
    </div>
  );
};

const _isBossAttack = (
  resultMsgId: EnumBossBattleMsg,
  bossHit: boolean,
  monsterDamage: number,
): boolean => {
  if (monsterDamage === 0) return false;
  if (resultMsgId === EnumBossBattleMsg.bossOneHitKill) return bossHit;
  if (resultMsgId === EnumBossBattleMsg.bossAttack) return bossHit;
  if (resultMsgId === EnumBossBattleMsg.bossPowerAttack) return bossHit;
  if (resultMsgId === EnumBossBattleMsg.bossCounterAttack) return bossHit;
  return false;
};
