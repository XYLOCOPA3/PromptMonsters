import { MintedBossImage } from "@/features/boss/components/MintedBossImage";
import { MintedBossStatus } from "@/features/boss/components/MintedBossStatus";
import { MintedBossTweetButton } from "@/features/boss/components/MintedBossTweetButton";
import { MintedText } from "@/features/boss/components/MintedText";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BossMintResultProps = BaseProps;

/**
 * BossMintResult
 * @keit0728
 * @param className Style from parent element
 */
export const BossMintResult = ({ className }: BossMintResultProps) => {
  return (
    <div
      className={clsx(
        className,
        "flex",
        "flex-col",
        "items-center",
        "max-w-[512px]",
      )}
    >
      <MintedText className={clsx("mb-[30px]")} />
      <MintedBossImage
        className={clsx("w-[250px]", "h-auto", "mb-[30px]", "md:w-[450px]")}
      />
      <MintedBossStatus className={clsx("mb-[10px]")} />
      <div className={clsx("w-[100%]", "flex", "justify-end")}>
        <MintedBossTweetButton />
      </div>
    </div>
  );
};
