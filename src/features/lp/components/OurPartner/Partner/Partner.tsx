import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type PartnerProps = {
  src: string;
  width: number;
  height: number;
} & BaseProps;

/**
 * Partner
 * @keit0728
 * @param className Style from parent element
 * @param src Image source
 * @param width Image width
 * @param height Image height
 */
export const Partner = ({ className, src, width, height }: PartnerProps) => {
  return (
    <div
      className={clsx(
        "bg-white",
        "w-[250px]",
        "h-[150px]",
        "flex",
        "justify-center",
        "items-center",
        "rounded-[10px]",
        "m-[20px]",
      )}
    >
      <Image
        className={clsx(className)}
        src={src}
        alt="partner-logo"
        width={width}
        height={height}
      />
    </div>
  );
};
