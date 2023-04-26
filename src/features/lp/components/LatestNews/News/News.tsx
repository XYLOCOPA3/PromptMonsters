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
      <div className={clsx("flex", "justify-center", "items-center")}>
        <Image
          className={clsx("w-[100%]", "min-w-[200px]")}
          src="/assets/images/bg-news.png"
          alt="thumbnail"
          width={1000}
          height={1000}
        />
      </div>
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-[50%]",
          "w-[70%]",
          "h-[80%]",
          "text-black",
        )}
      >
        <div
          className={clsx(
            "font-bold",
            "h-[50%]",
            "text-[15px]",
            "md:text-[30px]",
            "flex",
            "justify-start",
            "items-center",
          )}
        >
          Coming soon...
        </div>
        <div className={clsx("h-[50%]", "text-[10px]", "md:text-[20px]")}>
          Coming soon...
        </div>
      </div>
    </div>
  );
};
