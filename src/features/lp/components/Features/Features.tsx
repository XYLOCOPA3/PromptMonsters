import Image from "next/image";
import { Feature } from "@/features/lp/components/Features/Feature";
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
        className={clsx(
          className,
          "object-cover",
          "opacity-40",
          "w-[100%]",
          "h-[1200px]",
          "md:h-[100%]",
        )}
        src="/assets/images/bg-features.png"
        alt="bg-image"
        width={4000}
        height={2000}
      />
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-0",
          "w-[90%]",
        )}
      >
        <div
          className={clsx("flex", "flex-col", "justify-center", "items-center")}
        >
          <Image
            className={clsx("w-[10px]", "md:w-[12px]")}
            src="/assets/images/rectangle.svg"
            alt="thumbnail"
            width={20}
            height={20}
          />
        </div>
      </div>
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
              "font-bold",
              "flex",
              "justify-center",
              "items-center",
              "mb-[10px]",
              "md:text-[45px]",
            )}
          >
            <div
              className={clsx(
                "text-[30px]",
                "md:text-[45px]",
                "text-[#fc6a3d]",
              )}
            >
              3
            </div>
            <div
              className={clsx(
                "ml-[5px]",
                "text-[30px]",
                "md:text-[45px]",
                "md:ml-[10px]",
              )}
            >
              Features
            </div>
          </div>
          <div
            className={clsx(
              "flex",
              "flex-wrap",
              "justify-center",
              "items-center",
              "w-[100%]",
            )}
          >
            <Feature
              className={clsx("m-[20px]", "w-[25%]", "min-w-[200px]")}
              title="Unique AI-generated monsters"
              desc="Create the ultimate unique monster based on the words of the monster
              you think is the strongest."
            />
            <Feature
              className={clsx("m-[20px]", "w-[25%]", "min-w-[200px]")}
              title="Full on-chain dynamic NFTs"
              desc="Save your unique monsters as fully on-chain dynamic NFTs."
            />
            <Feature
              className={clsx("m-[20px]", "w-[25%]", "min-w-[200px]")}
              title="Online generative battles"
              desc="Engage in online battles with your Monster NFTs using an AI game
              engine."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
