import Image from "next/image";
import { PlayNowButton } from "@/features/lp/components/PlayNowButton";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type TopProps = BaseProps;

/**
 * Top
 * @keit0728
 * @param className Style from parent element
 */
export const Top = ({ className }: TopProps) => {
  return (
    <div className={clsx("relative", "w-[100%]")}>
      <Image
        className={clsx(
          className,
          "object-cover",
          "opacity-40",
          "w-[100%]",
          "h-[400px]",
          "md:h-[100%]",
        )}
        src="/assets/images/bg-top.png"
        alt="bg-top"
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
            className={clsx("w-[100%]", "md:w-[70%]")}
            src="/assets/images/prompt-monsters-title.png"
            alt="thumbnail"
            width={500}
            height={500}
          />
          <div
            className={clsx("text-gray-300", "text-[8px]", "md:text-[15px]")}
          >
            Generative Blockchain Game using AI as the game engine
          </div>
          <PlayNowButton className={clsx("mt-[20px]", "md:mt-[30px]")} />
        </div>
      </div>
    </div>
  );
};
