import { Spinner } from "@/components/elements/Spinner";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type ButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
} & BaseProps;

/**
 * Button
 * @keit0728
 * @param className 親要素から指定されるスタイル
 * @param children 子要素
 * @param disabled ボタンを無効化するかどうか
 * @param loading ローディング中かどうか
 * @param onClick クリック時の処理
 */
export const Button = ({
  className,
  children,
  disabled,
  loading,
  onClick,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "bg-gray-700",
        "text-white",
        "rounded-md",
        "shadow-md",
        "hover:bg-gray-800",
        "hover:shadow-lg",
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
