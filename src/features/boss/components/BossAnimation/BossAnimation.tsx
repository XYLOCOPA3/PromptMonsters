import { BossImage } from "@/features/boss/components/BossImage";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import clsx from "clsx";

export type BossAnimationProps = BaseProps;

/**
 * BossAnimation
 * @keit0728
 * @param className Style from parent element
 */
export const BossAnimation = ({ className }: BossAnimationProps) => {
  const bossBattle = useBossBattleValue();

  const lastIndex = bossBattle.resultMsgIds.length - 1;
  return (
    <div
      className={clsx(
        className,
        _isMonsterAttack(
          bossBattle.resultMsgIds[lastIndex],
          bossBattle.currentMonsterHit,
        )
          ? "animate-blink-1"
          : "",
      )}
    >
      <BossImage />
    </div>
  );
};

const _isMonsterAttack = (
  resultMsgId: EnumBossBattleMsg,
  monsterHit: boolean,
): boolean => {
  if (resultMsgId === EnumBossBattleMsg.monsterFightPhysicalAttack)
    return monsterHit;
  if (resultMsgId === EnumBossBattleMsg.monsterFightSpecialAttack)
    return monsterHit;
  if (resultMsgId === EnumBossBattleMsg.monsterFightOtherPhysicalAttack)
    return monsterHit;
  if (resultMsgId === EnumBossBattleMsg.monsterFightOtherSpecialAttack)
    return monsterHit;
  if (resultMsgId === EnumBossBattleMsg.monsterFightOtherPowerPhysicalAttack)
    return monsterHit;
  if (resultMsgId === EnumBossBattleMsg.monsterFightOtherPowerSpecialAttack)
    return monsterHit;
  return false;
};
