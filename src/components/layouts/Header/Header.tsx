import { Title } from "@/components/elements/Title";
import { LoginButton } from "@/features/auth";
import { MyShortProfile } from "@/features/profile";
import { useUserValue } from "@/hooks/useUser";
import clsx from "clsx";

/**
 * Header
 * @layout
 * @keit0728
 */
export const Header = () => {
  const user = useUserValue();

  return (
    <header
      className={clsx(
        "flex",
        "flex-col",
        "justify-center",
        "h-[70px]",
        "bg-[#161c22]",
        "mb-[30px]",
      )}
    >
      <div
        className={clsx("flex", "items-center", "justify-between", "m-[10px]")}
      >
        <Title className={clsx("ml-[10px]")} />
        {user.id === "" ? <LoginButton /> : <MyShortProfile />}
      </div>
    </header>
  );
};
