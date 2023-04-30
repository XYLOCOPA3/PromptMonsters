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
      <div className={clsx("font-bold", "text-[24px]", "mb-[20px]")}>
        # How to Play
      </div>
      <ol className={clsx("list-decimal", "list-outside", "pl-6", "mb-[30px]")}>
        <li className={clsx("mb-2")}>
          First, enter the desired features of the monster you want.
        </li>
        <li className={clsx("mb-2")}>
          Press this button to generate monster status based on the entered
          features.
          <GenerateButton
            className={clsx("w-[60px]", "my-[10px]")}
            onClick={() => {}}
          />
        </li>
        <li className={clsx("mb-2")}>
          You can have this monster battle against other monsters.
        </li>
      </ol>
      <div className={clsx("mb-2")}>
        Additionally, you can convert the monster into an NFT by paying{" "}
        {mintPrice === 0 ? "" : mintPrice} MCHC.
      </div>
      <div className={clsx("mb-2")}>
        Converting to an NFT allows you to save the monster{"'"}s battle record
        and participate in campaigns.
      </div>
      <div className={clsx("mb-2")}>
        In the future, we plan to make NFT-converted monsters usable in other
        BCGs, so please mint your monster and enjoy!{" "}
      </div>
    </div>
  );
};
