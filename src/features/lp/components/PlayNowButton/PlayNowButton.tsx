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
          "py-[5px]",
          "text-[10px]",
          "text-center",
          "font-bold",
          "rounded-[150px]",
          "md:text-[20px]",
        )}
      >
        PLAY NOW
      </Button>
    </Link>
  );
};
