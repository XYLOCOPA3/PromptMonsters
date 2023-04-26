import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type FeatureProps = {
  title: string;
  desc: string;
} & BaseProps;

/**
 * Feature
 * @keit0728
 * @param className Style from parent element
 * @param title Title
 * @param desc Description
 */
export const Feature = ({ className, title, desc }: FeatureProps) => {
  return (
    <div className={clsx(className, "relative")}>
      <div className={clsx("flex", "justify-center", "items-center")}>
        <Image
          className={clsx("w-[100%]", "min-w-[200px]")}
          src="/assets/images/bg-feature.png"
          alt="thumbnail"
          width={2000}
          height={2000}
        />
      </div>
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-[50%]",
          "w-[75%]",
          "h-[70%]",
        )}
      >
        <div
          className={clsx(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "w-[100%]",
            "h-[100%]",
          )}
        >
          <div
            className={clsx(
              "font-bold",
              "h-[25%]",
              "text-center",
              "text-[15px]",
              "md:text-[30px]",
            )}
          >
            {title}
          </div>
          <div
            className={clsx(
              "h-[50%]",
              "flex",
              "justify-center",
              "items-center",
            )}
          >
            <Image
              className={clsx("w-[80%]")}
              src="/assets/images/feature-icon.svg"
              alt="feature-icon"
              width={100}
              height={100}
            />
          </div>
          <div
            className={clsx(
              "w-[90%]",
              "h-[25%]",
              "text-[10px]",
              "md:text-[20px]",
            )}
          >
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
};
