import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type Feature03Props = BaseProps;

/**
 * Feature03
 * @keit0728
 * @param className Style from parent element
 */
export const Feature03 = ({ className }: Feature03Props) => {
  return (
    <div className={clsx(className, "relative")}>
      <Image
        className={clsx("w-[80px]", "md:w-[200px]")}
        src="/assets/images/bg-feature.jpg"
        alt="thumbnail"
        width={500}
        height={1000}
      />
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-[50%]",
          "w-[90%]",
        )}
      >
        <div
          className={clsx("flex", "flex-col", "justify-center", "items-center")}
        >
          <div
            className={clsx(
              "text-[5px]",
              "w-[80%]",
              "text-center",
              "font-bold",
              "md:text-[15px]",
            )}
          >
            Online generative battles
          </div>
          <Image
            className={clsx(
              "w-[15px]",
              "my-[5px]",
              "md:my-[10px]",
              "md:w-[40px]",
            )}
            src="/assets/images/feature-icon.svg"
            alt="thumbnail"
            width={100}
            height={100}
          />
          <div
            className={clsx(
              "text-[3px]",
              "md:text-[10px]",
              "w-[60%]",
              "text-justify",
            )}
          >
            Engage in online battles with your Monster NFTs using an AI game
            engine.
          </div>
        </div>
      </div>
    </div>
  );
};
