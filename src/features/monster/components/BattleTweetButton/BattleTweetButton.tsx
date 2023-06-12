import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/elements/Button";
import { useBattleValue } from "@/hooks/useBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { BattleModel } from "@/models/BattleModel";
import { MonsterModel } from "@/models/MonsterModel";
import { BaseProps } from "@/types/BaseProps";
import {
  countCharactersForTwitter,
  trimCharacters100,
} from "@/utils/charUtils";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BattleTweetButtonProps = BaseProps;

/**
 * Monster battle tweet button
 * @keit0728
 * @param className Style from parent element
 */
export const BattleTweetButton = ({ className }: BattleTweetButtonProps) => {
  const monster = useMonsterValue();
  const battle = useBattleValue();
  const { t: tCommon } = useTranslation("monsters");

  if (battle.winnerId === "") return <></>;
  return (
    <Link
      className={clsx(className)}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        _getBattleTweet(battle, monster),
      )}`}
      target="_blank"
    >
      <Button
        className={clsx("w-[40px]", "h-[40px]", "md:w-[120px]")}
        variant="twitter"
        shape="circle"
      >
        <div className={clsx("flex", "justify-center", "items-center")}>
          <Image
            className={clsx("w-[20px]")}
            src="/assets/images/twitter.svg"
            alt="twitter"
            width={100}
            height={100}
          />
          <div
            className={clsx("ml-[10px]", "text-black", "hidden", "md:inline")}
          >
            {tCommon("tweet")}
          </div>
        </div>
      </Button>
    </Link>
  );
};

/**
 * Get battle tweet
 * @param battle Battle
 * @param monster Monster
 * @return {string} Battle tweet
 */
const _getBattleTweet = (
  battle: BattleModel,
  monster: MonsterModel,
): string => {
  const battleDesc = trimCharacters100(battle.battleDescription);

  return `Fight!

${battleDesc}${countCharactersForTwitter(battleDesc) > 100 ? "..." : ""}

${monster.name} ${battle.winnerId !== battle.monsterBId ? "win!!!" : "lose..."}

Check out more stories here!
https://prompt-monsters.com/

#PromptMonsters #Alert`;
};
