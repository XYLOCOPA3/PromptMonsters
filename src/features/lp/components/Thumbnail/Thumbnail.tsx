import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type ThumbnailProps = BaseProps;

/**
 * Thumbnail
 * @keit0728
 * @param className Style from parent element
 */
export const Thumbnail = ({ className }: ThumbnailProps) => {
  return (
    <Image
      className={clsx(
        className,
        "w-[767px]",
        "h-[256px]",
        "object-cover",
        "opacity-20",
        "md:w-[1534px]",
        "md:h-[512px]",
        "z-[-1]",
      )}
      src="/assets/images/thumbnail.png"
      alt="thumbnail"
      width={1534}
      height={512}
    />
  );
};
