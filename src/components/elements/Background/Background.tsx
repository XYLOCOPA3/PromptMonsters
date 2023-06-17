import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BackgroundProps = { src: string } & BaseProps;

/**
 * Background
 * @keit0728
 * @param className Style from parent element
 */
export const Background = ({ className, src }: BackgroundProps) => {
  return (
    <Image
      className={clsx(
        className,
        "object-cover",
        "fixed",
        "top-0",
        "h-[100%]",
        "z-[-1]",
      )}
      src={src}
      alt="background"
      width={4000}
      height={2000}
    />
  );
};
