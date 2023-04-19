import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type FeatureInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & BaseProps;

/**
 * モンスターの特徴を入力する
 * @keit0728
 * @param className 親要素から指定されるスタイル
 * @param onChange 入力時の処理
 */
export const FeatureInput = ({ className, onChange }: FeatureInputProps) => {
  return (
    <input
      className={clsx("bg-gray-700", "px-2", "rounded-lg", className)}
      type="text"
      name="name"
      placeholder="Monster features: ex. fire, cool, dragon"
      onChange={onChange}
    />
  );
};
