import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/elements/Button";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { useMonsterValue } from "@/hooks/useMonster";
import { BossBattleModel } from "@/models/BossBattleModel";
import { BossModel } from "@/models/BossModel";
import { MonsterModel } from "@/models/MonsterModel";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleTweetButtonProps = BaseProps;

/**
 * BossBattleTweetButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleTweetButton = ({
  className,
}: BossBattleTweetButtonProps) => {
  const bossBattle = useBossBattleValue();
  const boss = useBossValue();

  const monster = useMonsterValue();
  const { t: tCommon } = useTranslation("common");

  if (monster.name === "") return <></>;
  return (
    <Link
      className={clsx(className)}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        _getBossBattleTweet(monster, bossBattle, boss),
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
 * Get generated tweet
 * @param monster Monster
 * @return {string} Generated tweet
 */
const _getBossBattleTweet = (
  monster: MonsterModel,
  bossBattle: BossBattleModel,
  boss: BossModel,
): string => {
  // TODO: ハイスコアだったらハイスコア文章表示
  return `Boss Battle!

Boss: ${boss.name}
  vs
You:  ${monster.name}

------

${bossBattle.lp !== 0
      ? `Your score is ... ${bossBattle.score} !!!`
      : `Your score is ... ${bossBattle.score} !\nYou lose...`
    }

${bossBattle.lp !== 0
      ? bossBattle.score > bossBattle.highScore
        ? "Congratulation!!!\nThis score is a high score!"
        : ""
      : "This time, you defeated...but waiting for the next challenge!"
    }


Let's play Prompt Monsters!
https://prompt-monsters.com/

#PromptMonsters #Alert`;
};
