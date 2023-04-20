import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type AbstractProps = BaseProps;

/**
 * Abstract
 * @keit0728
 * @param className Style from parent element
 */
export const Abstract = ({ className }: AbstractProps) => {
  return (
    <div className={clsx(className)}>
      <div
        className={clsx(
          "text-[14px]",
          "text-start",
          "font-bold",
          "mb-[10px]",
          "md:mb-[20px]",
          "md:text-[25px]",
        )}
      >
        Have you ever played a game in your childhood
      </div>
      <div
        className={clsx(
          "text-[14px]",
          "text-center",
          "font-bold",
          "mb-[10px]",
          "md:mb-[20px]",
          "md:text-[25px]",
        )}
      >
        where you created original monsters and
      </div>
      <div
        className={clsx(
          "text-[14px]",
          "text-end",
          "font-bold",
          "mb-[50px]",
          "md:text-[25px]",
          "md:mb-[100px]",
        )}
      >
        had them battle against each other?
      </div>
      <div
        className={clsx(
          "text-[50px]",
          "text-center",
          "font-bold",
          "md:text-[100px]",
        )}
      >
        This is it! 🚀
      </div>
    </div>
  );
};
