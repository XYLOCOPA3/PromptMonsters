import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type Feature01Props = BaseProps;

/**
 * Feature01
 * @keit0728
 * @param className Style from parent element
 */
export const Feature01 = ({ className }: Feature01Props) => {
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
            Unique <br />
            AI-generated monsters
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
            Create the ultimate unique monster based on the words of the monster
            you think is the strongest.
          </div>
        </div>
      </div>
    </div>
  );
};
