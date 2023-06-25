import { getMintRareMsg } from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useMintedBossValue } from "@/hooks/useMintedBoss";
import { BaseProps } from "@/types/BaseProps";
import { isRareStatus } from "@/utils/bossBattleUtils";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type MintedTextProps = BaseProps;

/**
 * MintedText
 * @keit0728
 * @param className Style from parent element
 */
export const MintedText = ({ className }: MintedTextProps) => {
  const boss = useBossValue();
  const mintedBoss = useMintedBossValue();
  const { t: tBoss } = useTranslation("boss");

  if (mintedBoss === undefined || mintedBoss.name === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "text-center",
        "font-bold",
        "text-[24px]",
        "md:text-[32px]",
      )}
    >
      <div>{tBoss("mintResult")}</div>
      {isRareStatus(mintedBoss.status) ? (
        <div
          className={clsx(
            "text-[16px]",
            "md:text-[16px]",
            "whitespace-pre-wrap",
          )}
        >
          <br />
          {getMintRareMsg(boss.name, tBoss("mintRare"))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
