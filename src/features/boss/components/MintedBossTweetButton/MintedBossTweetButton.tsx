import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/elements/Button";
import { LANGUAGES } from "@/const/language";
import { useBossValue } from "@/hooks/useBoss";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMintedBossValue } from "@/hooks/useMintedBoss";
import { BossModel } from "@/models/BossModel";
import { MonsterModel } from "@/models/MonsterModel";
import { BaseProps } from "@/types/BaseProps";
import { isRareStatus } from "@/utils/bossBattleUtils";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type MintedBossTweetButtonProps = BaseProps;

/**
 * MintedBossTweetButton
 * @keit0728
 * @param className Style from parent element
 */
export const MintedBossTweetButton = ({
  className,
}: MintedBossTweetButtonProps) => {
  const boss = useBossValue();
  const mintedBoss = useMintedBossValue();
  const language = useLanguageValue();
  const { t: tCommon } = useTranslation("common");

  if (mintedBoss === undefined) return <></>;
  if (mintedBoss.name === "" || language === "") return <></>;
  return (
    <Link
      className={clsx(className)}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        _getMintedBossTweet(language, mintedBoss, boss),
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
 * @param language language
 * @param mintedBoss mintedBoss
 * @return {string} Generated tweet
 */
const _getMintedBossTweet = (
  language: string,
  mintedBoss: MonsterModel,
  boss: BossModel,
): string => {
  switch (language) {
    case LANGUAGES[0]:
      return `${
        isRareStatus(mintedBoss.status)
          ? `Minted Rare ${boss.name}🎉`
          : `Minted ${boss.name}!`
      }

${boss.name}: "Oh my, thank you for minting me, little one 😊🙏💕"

Detail:
https://tofunft.com/nft/mch-verse/0x12C7aA85c8BE2b32bdCfC013Da08347EeE95c238/${
        mintedBoss.id
      }

Let's mint here!
https://prompt-monsters.com/boss
#PromptMonsters #Alert #BCG`;
    case LANGUAGES[1]:
      return `${
        isRareStatus(mintedBoss.status)
          ? `レア ${boss.name} をミントした🎉`
          : `${boss.name} をミントした！`
      }

${boss.name}「あら、おちびちゃん、あたしをミントしてくれてありがとね〜😊🙏💕」

詳細:
https://tofunft.com/nft/mch-verse/0x12C7aA85c8BE2b32bdCfC013Da08347EeE95c238/${
        mintedBoss.id
      }

Let's mint here!
https://prompt-monsters.com/boss
#PromptMonsters #Alert #BCG`;
    default:
      return "";
  }
};
