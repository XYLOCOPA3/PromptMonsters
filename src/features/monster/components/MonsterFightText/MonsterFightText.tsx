import { fightTextState } from "@/stores/fightTextState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

export type MonsterFightTextProps = BaseProps;

/**
 * Result of monster fight
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterFightText = ({ className }: MonsterFightTextProps) => {
  const fightText = useRecoilValue(fightTextState);

  if (fightText === "") return <></>;
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
      {`${fightText}`}
    </div>
  );
};
