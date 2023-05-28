import { Spinner } from "@/components/elements/Spinner";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

const shapes = {
  rounded: clsx("rounded-md"),
  circle: clsx("rounded-full"),
};

export type ButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  holdDown?: boolean;
  variant?: "primary" | "secondary" | "twitter" | "bossBattle";
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
  holdDown = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        className,
        _getVariant(variant, holdDown),
        "text-white",
        shapes[shape],
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

const _getVariant = (
  variant: "primary" | "secondary" | "twitter" | "bossBattle",
  holdDown: boolean,
): string => {
  switch (variant) {
    case "primary":
      return clsx(
        holdDown ? "bg-[#C53D14]" : "bg-[#EA4E1F]",
        "hover:bg-[#C53D14]",
        "hover:shadow-lg",
      );
    case "secondary":
      return clsx(
        holdDown ? "bg-gray-800" : "bg-gray-700",
        "hover:bg-gray-800",
        "hover:shadow-lg",
      );
    case "twitter":
      return clsx(
        holdDown ? "bg-[#D3DCE3]" : "bg-[#F1F6F9]",
        "hover:bg-[#D3DCE3]",
        "hover:shadow-lg",
      );
    case "bossBattle":
      return clsx(holdDown ? "bg-[#4E4E4E]" : "", "hover:bg-[#4E4E4E]");
    default:
      return "";
  }
};
