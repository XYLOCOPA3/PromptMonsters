import { Spinner } from "@/components/elements/Spinner";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

const variants = {
  primary: clsx("bg-[#EA4E1F]", "hover:bg-[#C53D14]", "hover:shadow-lg"),
  secondary: clsx("bg-gray-700", "hover:bg-gray-800", "hover:shadow-lg"),
};

export type ButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
} & BaseProps;

/**
 * Button
 * @keit0728
 * @param className Style from parent element
 * @param children Children elements
 * @param disabled Disabled or not
 * @param loading Loading or not
 * @param onClick Click event
 */
export const Button = ({
  className,
  children,
  variant = "primary",
  disabled,
  loading,
  onClick,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        variants[variant],
        "text-white",
        "rounded-md",
        "shadow-md",
        "select-none",
        className,
      )}
      onClick={onClick}
    >
      {loading ? (
        <div
          className={clsx("flex", "justify-center", "items-center", "w-[100%]")}
        >
          <Spinner className={clsx("w-[20px]", "h-[20px]", "border-[2px]")} />
        </div>
      ) : (
        children
      )}
    </button>
  );
};
