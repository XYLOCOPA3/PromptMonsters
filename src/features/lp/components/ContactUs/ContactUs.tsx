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
    <Link
      href="https://forms.office.com/r/ssKaZ4DBeC"
      className={clsx("no-underline")}
    >
      <Button
        className={clsx(
          className,
          "p-[10px]",
          "top-[200px]",
          "text-[15px]",
          "text-center",
          "font-bold",
          "md:px-[30px]",
          "md:top-[400px]",
          "md:text-[30px]",
        )}
        onClick={() => {
          console.log("Hello");
        }}
      >
        CONTACT US
      </Button>
    </Link>
  );
};
