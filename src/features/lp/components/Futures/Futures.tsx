import Image from "next/image";
import { Future } from "@/features/lp/components/Futures/Future/Future";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type FuturesProps = BaseProps;

/**
 * Futures
 * @keit0728
 * @param className Style from parent element
 */
export const Futures = ({ className }: FuturesProps) => {
  return (
    <div className={clsx("relative", "w-[100%]")}>
      <Image
        className={clsx(
          className,
          "object-cover",
          "opacity-40",
          "w-[100%]",
          "h-[1450px]",
          "md:h-[100%]",
        )}
        src="/assets/images/bg-future.png"
        alt="thumbnail"
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
              "text-[30px]",
              "mb-[10px]",
              "md:text-[45px]",
            )}
          >
            Future
          </div>
          <div className={clsx("flex", "flex-wrap", "justify-evenly")}>
            <Future
              className={clsx("m-[10px]", "w-[40%]", "min-w-[200px]")}
              title="Generate images"
              desc="Based on your monster NFT data Develop a customized AI model for Prompt
              Monsters and can generate great monster images from the monster NFT
              data."
              src="/assets/images/future-icon-01.png"
            />
            <Future
              className={clsx("m-[10px]", "w-[40%]", "min-w-[200px]")}
              title="Evolution and Fusion"
              desc="Enable the development of monsters through loot and other BCG items, and the fusion of monsters with each other."
              src="/assets/images/future-icon-02.png"
            />
            <Future
              className={clsx("m-[10px]", "w-[40%]", "min-w-[200px]")}
              title="Improve strategy"
              desc="Add monster skill selection, prompt instruction, and party creation features."
              src="/assets/images/future-icon-03.png"
            />
            <Future
              className={clsx("m-[10px]", "w-[40%]", "min-w-[200px]")}
              title="Token rewards"
              desc="Add a leader board, seasonal ranking, and token reward system based on battle records.
              "
              src="/assets/images/future-icon-04.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
