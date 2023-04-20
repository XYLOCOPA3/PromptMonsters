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
 * @param className Style from parent element
 * @param loading Loading or not
 * @param onClick Click event
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
