import Image from "next/image";
import Link from "next/link";
import { LoginButton } from "@/features/auth";
import { MyShortProfile } from "@/features/profile";
import { useUserValue } from "@/hooks/useUser";
import clsx from "clsx";

/**
 * Header
 * @keit0728
 */
export const Header = () => {
  const user = useUserValue();

  return (
    <header className={clsx("fixed", "w-[100%]", "top-0", "z-[1]")}>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-between",
          "m-[10px]",
          "bg-[#292B2F]",
          "bg-opacity-[80%]",
          "rounded-[50px]",
        )}
      >
        <Link className={clsx("flex", "items-center")} href="/">
          <Image
            className={clsx(
              "w-[30px]",
              "ml-[4px]",
              "my-[4px]",
              "md:ml-[20px]",
              "md:my-[10px]",
              "md:w-[40px]",
              "md:h-[40px]",
            )}
            src="/assets/images/prompt-monsters-icon.svg"
            alt="prompt-monsters-icon"
            width={100}
            height={100}
          />
          {/* <Image
            className={clsx("ml-[10px]", "w-[70px]", "md:w-[120px]")}
            src="/assets/images/prompt-monsters-title.png"
            alt="title"
            width={500}
            height={500}
          /> */}
        </Link>
        {user.id === "" ? (
          <LoginButton className={clsx("mr-[4px]", "md:mr-[20px]")} />
        ) : (
          <MyShortProfile className={clsx("mr-[4px]", "md:mr-[20px]")} />
        )}
      </div>
    </header>
  );
};
