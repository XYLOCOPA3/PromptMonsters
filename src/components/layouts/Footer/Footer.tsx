import Link from "next/link";
import clsx from "clsx";

export const Footer = () => {
  return (
    <footer
      className={clsx(
        "h-[32px]",
        "flex",
        "justify-center",
        "items-center",
        "text-[10px]",
        "bg-[#161c22]",
        "p-4",
        "md:text-sm",
      )}
    >
      © 2023
      <Link
        className={clsx("mx-2", "text-blue-300", "font-bold")}
        href="https://xylocopa.xyz/"
      >
        XYLOCOPA Inc.
      </Link>
      All Rights Reserved.
    </footer>
  );
};
