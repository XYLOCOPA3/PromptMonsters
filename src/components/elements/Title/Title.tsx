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
    <div className={clsx("text-2xl", "font-bold", className)}>
      Prompt Monsters
    </div>
  );
};
