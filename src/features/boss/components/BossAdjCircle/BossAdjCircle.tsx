import {
  BOSS_ADJ_STD,
  FIRST_TURN,
  K_TURN,
  MAX_LIFE_POINT,
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
        "left-0",
        "bg-[#272727]/80",
        "rounded-full",
        "border-[1px]",
        "h-[30px]",
        "px-[10px]",
        "text-[14px]",
        bossBattle.lp < MAX_LIFE_POINT / 4 ? "text-[#FCA7A4]" : "",
        bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
        "md:h-[35px]",
        "md:text-[16px]",
      )}
    >
      <span className={clsx(bossAdj > BOSS_ADJ_STD ? "text-[#f86868]" : "")}>
        ⚔️{bossAdj}%
      </span>
    </div>
  );
};
