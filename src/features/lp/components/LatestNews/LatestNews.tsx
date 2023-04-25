import Image from "next/image";
import { News } from "@/features/lp/components/LatestNews/News";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type LatestNewsProps = BaseProps;

/**
 * LatestNews
 * @keit0728
 * @param className Style from parent element
 */
export const LatestNews = ({ className }: LatestNewsProps) => {
  return (
    <div className={clsx("relative", "w-[100%]")}>
      <Image
        className={clsx(className, "object-cover", "opacity-40")}
        src="/assets/images/bg-image-04.jpg"
        alt="thumbnail"
        width={4000}
        height={2000}
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
              "text-[20px]",
              "mb-[30px]",
              "md:mb-[0px]",
              "md:text-[45px]",
            )}
          >
            Latest News
          </div>
          <div className={clsx("flex", "flex-wrap", "justify-evenly")}>
            <News className={clsx("mx-[20px], my-[30px], md:m-[30px]")} />
          </div>
        </div>
      </div>
    </div>
  );
};
