import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type FutureProps = {
  title: string;
  desc: string;
  src: string;
} & BaseProps;

/**
 * Future
 * @keit0728
 * @param className Style from parent element
 * @param title Title of future
 * @param desc Description of future
 * @param src Image source of future
 */
export const Future = ({ className, title, desc, src }: FutureProps) => {
  return (
    <div
      className={clsx(
        className,
        "flex",
        "flex-col",
        "items-center",
        "w-[120px]",
        "md:w-[250px]",
      )}
    >
      <Image
        className={clsx(
          "w-[100px]",
          "mb-[10px]",
          "rounded-2xl",
          "md:w-[250px]",
        )}
        src={src}
        alt="thumbnail"
        width={500}
        height={500}
      />
      <div
        className={clsx(
          "text-[5px]",
          "w-[100%]",
          "text-[#EA4E1F]",
          "mb-[5px]",
          "font-bold",
          "md:text-[15px]",
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          "text-[3px]",
          "w-[100%]",
          "text-justify",
          "md:text-[10px]",
        )}
      >
        {desc}
      </div>
    </div>
  );
};
