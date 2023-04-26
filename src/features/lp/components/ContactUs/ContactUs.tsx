import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/elements/Button";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type ContactUsProps = BaseProps;

/**
 * ContactUs
 * @keit0728
 * @param className Style from parent element
 */
export const ContactUs = ({ className }: ContactUsProps) => {
  return (
    <div className={clsx("relative", "w-[100%]")}>
      <Image
        className={clsx(
          className,
          "object-cover",
          "opacity-20",
          "h-[150px]",
          "md:h-[200px]",
        )}
        src="/assets/images/bg-contact-us.png"
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
            alt="rectangle"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div
        className={clsx(
          "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "top-[50%]",
        )}
      >
        <Link
          href="https://forms.office.com/r/ssKaZ4DBeC"
          className={clsx("no-underline")}
        >
          <Button
            className={clsx(
              className,
              "p-[10px]",
              "text-[15px]",
              "text-center",
              "font-bold",
              "md:px-[30px]",
              "md:text-[30px]",
            )}
          >
            CONTACT US
          </Button>
        </Link>
      </div>
    </div>
  );
};
