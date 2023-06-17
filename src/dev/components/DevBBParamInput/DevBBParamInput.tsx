import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type DevBBParamInputProps = {
  title: string;
  kParam: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & BaseProps;

/**
 * DevBBParamInput
 * @keit0728
 */
export const DevBBParamInput = ({
  className,
  title,
  kParam,
  onChange,
}: DevBBParamInputProps) => {
  return (
    <div className={clsx(className, "m-[5px]", "flex", "items-center")}>
      <div className={clsx("mr-[5px]")}>{title}</div>
      <input
        className={clsx(
          "bg-gray-700",
          "rounded-lg",
          "p-[5px]",
          "text-start",
          "w-[100px]",
        )}
        type="text"
        name="name"
        autoComplete="off"
        onChange={onChange}
        value={kParam}
      />
    </div>
  );
};
