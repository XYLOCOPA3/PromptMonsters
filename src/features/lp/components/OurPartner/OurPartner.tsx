import Image from "next/image";
import { Partner } from "@/features/lp/components/OurPartner/Partner";
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
    <div className={clsx("relative", "w-[100%]")}>
      <Image
        className={clsx(
          className,
          "object-cover",
          "opacity-40",
          "w-[100%]",
          "h-[670px]",
          "md:h-[500px]",
        )}
        src="/assets/images/bg-our-partner.png"
        alt="bg-our-partner"
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
            Our Partner
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
            <Partner
              className={clsx("w-[120px]")}
              src="/assets/images/OASYS_logoFIX.png"
              width={200}
              height={200}
            />
            <Partner
              className={clsx("w-[200px]")}
              src="/assets/images/mch-logo.png"
              width={200}
              height={200}
            />
            <Partner
              className={clsx("w-[200px]", "rounded-lg")}
              src="/assets/images/aihub-logo.png"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
