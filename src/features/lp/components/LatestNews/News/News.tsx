import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type NewsProps = BaseProps;

/**
 * News
 * @keit0728
 * @param className Style from parent element
 */
export const News = ({ className }: NewsProps) => {
  return (
    <div className={clsx(className, "relative")}>
      <Image
        className={clsx("w-[150px]", "md:w-[400px]")}
        src="/assets/images/bg-news.png"
        alt="thumbnail"
        width={1000}
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
          className={clsx(
            "flex",
            "flex-col",
            "justify-center",
            "items-center",
            "text-[#292B2F]",
          )}
        >
          <div
            className={clsx(
              "text-[10px]",
              "w-[70%]",
              "font-bold",
              "mb-[20px]",
              "md:mb-[50px]",
              "md:text-[30px]",
            )}
          >
            Coming soon...
          </div>
          <div className={clsx("text-[10px]", "w-[70%]", "md:text-[15px]")}>
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};
