import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type TitleProps = BaseProps;

/**
 * Title
 * @keit0728
 * @param className Style from parent element
 */
export const Title = ({ className }: TitleProps) => {
  return (
    <div
      className={clsx(
        className,
        "w-[100%]",
        "top-[70px]",
        "text-[40px]",
        "text-center",
        "font-bold",
        "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "z-[-2]",
        "md:w-[1000px]",
        "md:top-[120px]",
        "md:text-[80px]",
      )}
    >
      Prompt Monsters
    </div>
  );
};
