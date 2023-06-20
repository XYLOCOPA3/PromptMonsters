import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/elements/Button";
import { MAX_LIFE_POINT } from "@/const/bossBattle";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BossHelpProps = BaseProps;

/**
 * BossHelp
 * @keit0728
 * @param className Style from parent element
 */
export const BossHelp = ({ className }: BossHelpProps) => {
  const bossBattle = useBossBattleValue();
  const { locale } = useRouter();

  return (
    <Link
      href={
        locale === "ja"
          ? "https://xylocopa.notion.site/Boss-Battle-07781f9c428242e9b018eace0a036685?pvs=4"
          : "https://xylocopa.notion.site/English-How-to-play-Boss-Battle-dcb04db635fb4fa59983f52165d12fa1?pvs=4"
      }
      target="_blank"
    >
      <Button
        className={clsx(
          className,
          "absolute",
          "flex",
          "justify-center",
          "items-center",
          "z-[1]",
          "top-[10px]",
          "right-0",
          "rounded-full",
          "h-[30px]",
          "text-[14px]",
          "md:h-[35px]",
          "md:text-[16px]",
        )}
        variant="none"
      >
        <Image
          className={clsx("w-[30px]")}
          src={
            bossBattle.lp < MAX_LIFE_POINT / 4
              ? "/assets/images/help_white_24dp-pink.svg"
              : "/assets/images/help_white_24dp.svg"
          }
          alt="help-icon"
          width={50}
          height={50}
        />
      </Button>
    </Link>
  );
};
