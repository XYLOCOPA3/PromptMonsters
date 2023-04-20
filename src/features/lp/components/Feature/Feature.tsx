import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type FeatureProps = {
  title: string;
  description: string;
} & BaseProps;

/**
 * Feature
 * @keit0728
 * @param className Style from parent element
 */
export const Feature = ({ className, title, description }: FeatureProps) => {
  return (
    <div
      className={clsx(
        className,
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "whitespace-pre-wrap",
        "w-[90%]",
        "mb-[30px]",
        "md:w-[30%]",
        "md:mb-[20px]",
      )}
    >
      <div
        className={clsx(
          "text-[20px]",
          "font-bold",
          "text-center",
          "md:text-[30px]",
        )}
      >
        {title}
      </div>
      <br />
      <br />
      <div className={clsx("text-[10px]", "text-justify", "md:text-[15px]")}>
        {description}
      </div>
    </div>
  );
};
