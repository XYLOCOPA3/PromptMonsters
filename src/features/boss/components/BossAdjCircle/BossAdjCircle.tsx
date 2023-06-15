import { BOSS_ADJ_STD } from "@/const/bossBattle";
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
          bossBattle.bossAdj > BOSS_ADJ_STD
            ? "text-[#79FF63]"
            : bossBattle.bossAdj < BOSS_ADJ_STD
            ? "text-[#f86868]"
            : "",
        )}
      >
        {bossBattle.bossAdj}
      </span>
    </div>
  );
};
