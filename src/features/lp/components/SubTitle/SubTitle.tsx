import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type SubTitleProps = BaseProps;

/**
 * SubTitle
 * @keit0728
 * @param className Style from parent element
 */
export const SubTitle = ({ className }: SubTitleProps) => {
  return (
    <div
      className={clsx(
        className,
        "w-[500px]",
        "top-[120px]",
        "text-[10px]",
        "text-center",
        "text-gray-300",
        "font-bold",
        "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "z-[-2]",
        "md:w-[1000px]",
        "md:top-[200px]",
        "md:text-[20px]",
      )}
    >
      - with your own original monsters -
    </div>
  );
};
