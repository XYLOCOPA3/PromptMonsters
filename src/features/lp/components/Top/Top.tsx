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
        className={clsx(className, "object-cover", "opacity-40")}
        src="/assets/images/bg-image-01.jpg"
        alt="thumbnail"
        width={4000}
        height={2000}
      />
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-[58%]",
          "w-[90%]",
          "md:top-[50%]",
        )}
      >
        <div
          className={clsx("flex", "flex-col", "justify-center", "items-center")}
        >
          <div className={clsx("flex", "justify-center", "items-center")}>
            <Image
              className={clsx("w-[70px]", "md:w-[200px]")}
              src="/assets/images/prompt-monsters-icon.svg"
              alt="thumbnail"
              width={500}
              height={500}
            />
            <div
              className={clsx(
                "text-[20px]",
                "ml-[20px]",
                "font-bold",
                "md:text-[50px]",
              )}
            >
              <div>Prompt</div>
              <div className={clsx("ml-[20px]")}>Monsters</div>
            </div>
          </div>
          <div
            className={clsx(
              "text-gray-300",
              "mt-[20px]",
              "text-[8px]",
              "md:mt-[30px]",
              "md:text-[15px]",
            )}
          >
            Generative Blockchain Game using AI as the game engine
          </div>
          <PlayNowButton className={clsx("mt-[20px]", "md:mt-[30px]")} />
        </div>
      </div>
    </div>
  );
};
