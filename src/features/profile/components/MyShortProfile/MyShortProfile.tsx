import Image from "next/image";
import { useUserValue } from "@/hooks/useUser";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MyShortProfileProps = BaseProps;

/**
 * Display user address and icon
 * @feature
 * @keit0728
 * @param className Style from parent element
 * @note Hidden when user is not logged in
 */
export const MyShortProfile = ({ className }: MyShortProfileProps) => {
  const user = useUserValue();

  if (user.id === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "flex",
        "items-center",
        "border-[1px]",
        "border-gray-800",
        "rounded-full",
      )}
    >
      <Image
        className={clsx(
          "rounded-full",
          "w-[40px]",
          "h-[40px]",
          "bg-[#0d1117]",
          "border-[1px]",
          "border-gray-800",
          "mr-[10px]",
        )}
        src={user.icon}
        alt="userIcon"
        width={50}
        height={50}
      />
      <div className={clsx("w-[100px]", "truncate")}>{user.id}</div>
    </div>
  );
};
