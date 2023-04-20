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
    <Link href="/monsters" className={clsx("no-underline")}>
      <Button
        className={clsx(
          className,
          "p-[10px]",
          "top-[200px]",
          "text-[15px]",
          "text-center",
          "font-bold",
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "md:px-[30px]",
          "md:top-[400px]",
          "md:text-[30px]",
        )}
        onClick={() => {
          console.log("Hello");
        }}
      >
        PLAY NOW
      </Button>
    </Link>
  );
};
