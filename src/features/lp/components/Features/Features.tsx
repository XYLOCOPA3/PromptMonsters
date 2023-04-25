import Image from "next/image";
import { Feature01 } from "@/features/lp/components/Features/Feature01";
import { Feature02 } from "@/features/lp/components/Features/Feature02";
import { Feature03 } from "@/features/lp/components/Features/Feature03";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type FeaturesProps = BaseProps;

/**
 * Features
 * @keit0728
 * @param className Style from parent element
 */
export const Features = ({ className }: FeaturesProps) => {
  return (
    <div className={clsx("relative", "w-[100%]")}>
      <Image
        className={clsx(className, "object-cover", "opacity-40")}
        src="/assets/images/bg-image-02.jpg"
        alt="thumbnail"
        width={4000}
        height={2000}
      />
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-[48%]",
          "w-[90%]",
        )}
      >
        <div
          className={clsx("flex", "flex-col", "justify-center", "items-center")}
        >
          <Image
            className={clsx("w-[6px]", "md:w-[12px]")}
            src="/assets/images/rectangle.svg"
            alt="thumbnail"
            width={20}
            height={20}
          />
          <div
            className={clsx(
              "font-bold",
              "flex",
              "justify-center",
              "items-center",
              "mb-[10px]",
            )}
          >
            <div
              className={clsx(
                "text-[20px]",
                "md:text-[45px]",
                "text-[#fb8967]",
              )}
            >
              3
            </div>
            <div
              className={clsx(
                "ml-[5px]",
                "pt-[4px]",
                "text-[10px]",
                "md:ml-[10px]",
                "md:pt-[8px]",
                "md:text-[30px]",
              )}
            >
              features
            </div>
          </div>
          <div className={clsx("flex")}>
            <Feature01 className={clsx("mx-[10px]")} />
            <Feature02 className={clsx("mx-[10px]")} />
            <Feature03 className={clsx("mx-[10px]")} />
          </div>
        </div>
      </div>
    </div>
  );
};
