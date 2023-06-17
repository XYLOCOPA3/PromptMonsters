import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type TwitterIconProps = BaseProps;

/**
 * TwitterIcon
 * @keit0728
 * @param className Style from parent element
 */
export const TwitterIcon = ({ className }: TwitterIconProps) => {
  const { pathname } = useRouter();

  if (pathname === "/boss/battle") return <></>;
  return (
    <Link
      href="https://twitter.com/prompt_monsters"
      className={clsx(
        className,
        "fixed",
        "top-[70px]",
        "right-0",
        "m-4",
        "w-8",
        "h-8",
        "cursor-pointer",
        "z-[1]",
      )}
      target="_blank"
    >
      <Image
        src="/assets/images/twitter.svg"
        alt="twitter"
        width={100}
        height={100}
      />
    </Link>
  );
};
