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
    <div className={clsx(className, "flex", "flex-col", "items-center")}>
      <Image
        className={clsx("mb-[10px]", "rounded-2xl", "w-[200px]", "md:w-[80%]")}
        src={src}
        alt="bg-future"
        width={500}
        height={500}
      />
      <div
        className={clsx(
          "text-[20px]",
          "w-[200px]",
          "text-[#EA4E1F]",
          "mb-[5px]",
          "font-bold",
          "md:w-[80%]",
          "md:text-[25px]",
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          "text-[12px]",
          "w-[200px]",
          "md:w-[80%]",
          "md:text-[15px]",
        )}
      >
        {desc}
      </div>
    </div>
  );
};
