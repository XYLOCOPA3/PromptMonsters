import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

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
  const { t: tCommon } = useTranslation("common");

  return (
    <input
      className={clsx("bg-gray-700", "px-2", "rounded-lg", className)}
      type="text"
      name="name"
      placeholder={tCommon("featurePlaceholder") as string}
      autoComplete="off"
      onChange={onChange}
    />
  );
};
