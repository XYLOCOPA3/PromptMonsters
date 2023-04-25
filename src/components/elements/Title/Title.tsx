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
        "hidden",
        "text-[22px]",
        "font-bold",
        "md:text-[22px]",
        "md:inline",
      )}
    >
      Prompt Monsters
    </div>
  );
};
