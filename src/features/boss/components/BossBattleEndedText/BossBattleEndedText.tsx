import { bossBattleEndedState } from "@/stores/bossBattleEndedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

export type BossBattleEndedTextProps = BaseProps;

/**
 * BossBattleEndedText
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleEndedText = ({
  className,
}: BossBattleEndedTextProps) => {
  const bossBattleEnded = useRecoilValue(bossBattleEndedState);
  const { t: tBoss } = useTranslation("boss");

  if (!bossBattleEnded) return <></>;
  return (
    <div
      className={clsx(
        className,
        "bg-black/70",
        "py-[10px]",
        "-rotate-15",
        "font-bold",
      )}
    >
      {tBoss("ended")}
    </div>
  );
};
