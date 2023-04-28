import { Spinner } from "@/components/elements/Spinner";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

const variants = {
  primary: clsx("bg-[#EA4E1F]", "hover:bg-[#C53D14]", "hover:shadow-lg"),
  secondary: clsx("bg-gray-700", "hover:bg-gray-800", "hover:shadow-lg"),
  twitter: clsx("bg-[#F1F6F9]", "hover:bg-[#D3DCE3]", "hover:shadow-lg"),
};

const shapes = {
  rounded: clsx("rounded-md"),
  circle: clsx("rounded-full"),
};

export type ButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "twitter";
  shape?: "rounded" | "circle";
  onClick?: () => void;
} & BaseProps;

/**
 * Button
 * @keit0728
 * @param className Style from parent element
 * @param children Children elements
 * @param disabled Disabled or not
 * @param loading Loading or not
 * @param variant Button variant
 * @param shape Button shape
 * @param onClick Click event
 */
export const Button = ({
  className,
  children,
  variant = "primary",
  shape = "rounded",
  disabled,
  loading,
  onClick,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        className,
        variants[variant],
        "text-white",
        shapes[shape],
        "shadow-md",
        "select-none",
        "disabled:cursor-default",
        "disabled:opacity-50",
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
