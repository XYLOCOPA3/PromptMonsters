import { GenerateButton } from "@/features/monster";
import { useMintPriceValue } from "@/hooks/useMintPrice";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type PlayNoteProps = BaseProps;

/**
 * Monster battle tweet button
 * @keit0728
 * @param className Style from parent element
 */
export const PlayNote = ({ className }: PlayNoteProps) => {
  const mintPrice = useMintPriceValue();

  return (
    <div
      className={clsx(
        className,
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "text-justify",
      )}
    >
      <div className={clsx("font-bold")}>How to Play:</div>
      <ol className={clsx("list-decimal", "list-outside", "pl-6")}>
        <li className={clsx("mb-2")}>
          First, enter the desired features of the monster you want.
        </li>
        <li className={clsx("mb-2")}>
          Press this button to generate monster information based on the entered
          features.
          <GenerateButton
            className={clsx("w-[60px]", "my-[10px]")}
            onClick={() => {}}
          />
        </li>
        <li className={clsx("mb-2")}>
          You can mint the generated monster as an NFT by paying{" "}
          {mintPrice === 0 ? "" : mintPrice} MCHC.
        </li>
        <li className={clsx("mb-2")}>
          You can battle against other NFT-converted monsters.
        </li>
      </ol>
    </div>
  );
};
