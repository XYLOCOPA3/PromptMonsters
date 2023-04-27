import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/elements/Button";
import { useMonsterValue } from "@/hooks/useMonster";
import { MonsterModel } from "@/models/MonsterModel";
import { BaseProps } from "@/types/BaseProps";
import { countCharacters, trimCharacters100 } from "@/utils/charUtils";
import clsx from "clsx";

export type GenerateTweetButtonProps = BaseProps;

/**
 * Monster tweet button
 * @keit0728
 * @param className Style from parent element
 */
export const GenerateTweetButton = ({
  className,
}: GenerateTweetButtonProps) => {
  const monster = useMonsterValue();

  if (monster.name === "") return <></>;
  return (
    <Link
      className={clsx(className)}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        _getGeneratedTweet(monster),
      )}`}
      target="_blank"
    >
      <Button
        className={clsx("w-[100px]", "h-[40px]", "rounded-[200px]")}
        variant="twitter"
      >
        <div className={clsx("flex", "justify-center", "items-center")}>
          <Image
            className={clsx("w-[20px]")}
            src="/assets/images/twitter.svg"
            alt="twitter"
            width={100}
            height={100}
          />
          <div className={clsx("ml-[10px]", "text-black")}>Tweet</div>
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
const _getGeneratedTweet = (monster: MonsterModel): string => {
  const flavor = trimCharacters100(monster.flavor);
  const skills = monster.skills.join("\n- ");

  return `Generated a monster

${monster.name}
${flavor}${countCharacters(flavor) > 100 ? "..." : ""}
Skills:
- ${skills}

Check Monster here!
https://prompt-monsters-demo-jp.azurewebsites.net/

#PromptMonsters #Alert`;
};
