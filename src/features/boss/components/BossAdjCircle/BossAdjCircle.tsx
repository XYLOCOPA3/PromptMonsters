import {
  BOSS_ADJ_STD,
  FIRST_TURN,
  K_TURN,
  MAX_TURN_ADJ,
} from "@/const/bossBattle";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BossAdjCircleProps = BaseProps;

/**
 * BossAdjCircle
 * @keit0728
 * @param className Style from parent element
 */
export const BossAdjCircle = ({ className }: BossAdjCircleProps) => {
  const bossBattle = useBossBattleValue();

  let turnAdj = K_TURN * (bossBattle.turn - 1);
  if (bossBattle.turn === FIRST_TURN) turnAdj = 1;
  if (turnAdj > MAX_TURN_ADJ) turnAdj = MAX_TURN_ADJ;
  const bossAdj = Math.floor(bossBattle.bossAdj * turnAdj);

  return (
    <div
      className={clsx(
        className,
        "absolute",
        "flex",
        "justify-center",
        "items-center",
        "z-[1]",
        "top-[10px]",
        "right-[10px]",
        "bg-[#272727]/80",
        "rounded-full",
        "border-[1px]",
        "w-[40px]",
        "h-[40px]",
        "text-[14px]",
        "md:w-[50px]",
        "md:h-[50px]",
        "md:text-[16px]",
      )}
    >
      <span
        className={clsx(
          bossAdj > BOSS_ADJ_STD
            ? "text-[#f86868]"
            : bossAdj < BOSS_ADJ_STD
            ? "text-[#79FF63]"
            : "",
        )}
      >
        {bossAdj}
      </span>
    </div>
  );
};
