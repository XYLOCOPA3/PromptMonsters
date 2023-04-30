import Image from "next/image";
import { Button } from "@/components/elements/Button";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

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
  const disable = useRecoilValue(disableState);

  return (
    <Button
      className={clsx(
        className,
        "h-[40px]",
        "flex",
        "justify-center",
        "items-center",
      )}
      disabled={disable}
      variant="secondary"
      loading={loading}
      onClick={onClick}
    >
      <Image
        className={clsx("w-[30px]", "h-[30px]")}
        src="/assets/images/smart_toy_white_24dp.svg"
        alt="generate-icon"
        width={50}
        height={50}
      />
    </Button>
  );
};
