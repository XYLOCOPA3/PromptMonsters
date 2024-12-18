import Link from "next/link";
import { Button } from "@/components/elements/Button";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type PlayNowButtonProps = BaseProps;

/**
 * PlayNowButton
 * @keit0728
 * @param className Style from parent element
 */
export const PlayNowButton = ({ className }: PlayNowButtonProps) => {
  return (
    <Link
      href="/monsters"
      className={clsx(
        className,
        "no-underline",
        "w-[100%]",
        "flex",
        "justify-center",
        "items-center",
      )}
    >
      <Button
        className={clsx(
          "w-[40%]",
          "h-[35px]",
          "py-[5px]",
          "text-[14px]",
          "text-center",
          "font-bold",
          "rounded-[150px]",
          "md:w-[40%]",
          "md:h-[40px]",
          "md:text-[20px]",
        )}
      >
        PLAY NOW
      </Button>
    </Link>
  );
};
