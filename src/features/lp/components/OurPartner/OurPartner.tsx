import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type OurPartnerProps = BaseProps;

/**
 * OurPartner
 * @keit0728
 * @param className Style from parent element
 */
export const OurPartner = ({ className }: OurPartnerProps) => {
  return (
    <div className={clsx("w-[100%]", "mt-[30px]")}>
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
            "md:mb-[30px]",
            "md:text-[45px]",
          )}
        >
          Our Partner
        </div>
        <div
          className={clsx(
            "flex",
            "flex-wrap",
            "justify-evenly",
            "items-center",
            "mb-[10px]",
          )}
        >
          <Image
            className={clsx(
              "w-[100px]",
              "rounded-lg",
              "mx-[20px]",
              "mb-[30px]",
              "md:w-[120px]",
            )}
            src="/assets/images/OASYS_logoFIX.png"
            alt="thumbnail"
            width={200}
            height={200}
          />
          <Image
            className={clsx(
              "rounded-lg",
              "mx-[20px]",
              "mb-[30px]",
              "w-auto",
              "h-[50px]",
              "md:h-[70px]",
            )}
            src="/assets/images/mch_logo_yoko_w.png"
            alt="thumbnail"
            width={1000}
            height={200}
          />
          <Image
            className={clsx(
              "rounded-lg",
              "mx-[20px]",
              "mb-[30px]",
              "w-auto",
              "h-[50px]",
              "md:h-[50px]",
            )}
            src="/assets/images/aihub-logo.jpg"
            alt="thumbnail"
            width={1000}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};
