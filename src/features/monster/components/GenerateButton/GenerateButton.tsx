import Image from "next/image";
import { Button } from "@/components/elements/Button";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type GenerateButtonProps = {
  loading?: boolean;
  onClick: () => void;
} & BaseProps;

/**
 * GenerateButton
 * @keit0728
 * @param className 親要素から指定されるスタイル
 * @param loading ローディング中かどうか
 * @param onClick クリック時の処理
 */
export const GenerateButton = ({
  className,
  loading,
  onClick,
}: GenerateButtonProps) => {
  return (
    <Button
      className={clsx(
        className,
        "select-none",
        "h-[40px]",
        "flex",
        "justify-center",
        "items-center",
      )}
      loading={loading}
      onClick={onClick}
    >
      <Image
        className={clsx("w-[30px]", "h-[30px]")}
        src="/assets/images/smart_toy_white_24dp.svg"
        alt="communityIcon"
        width={50}
        height={50}
      />
    </Button>
  );
};
