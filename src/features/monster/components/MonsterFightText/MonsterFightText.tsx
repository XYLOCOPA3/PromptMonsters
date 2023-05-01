import { useBattleValue } from "@/hooks/useBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MonsterFightTextProps = BaseProps;

/**
 * Result of monster fight
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterFightText = ({ className }: MonsterFightTextProps) => {
  const battle = useBattleValue();
  const monster = useMonsterValue();

  if (battle.winnerId === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "text-justify",
        "whitespace-pre-wrap",
      )}
    >
      <div>{battle.battleDesc}</div>
      <br />
      <div>
        {monster.name}{" "}
        {battle.winnerName === monster.name ? "win!!!" : "lose..."}
      </div>
    </div>
  );
};
