import { useBossValue } from "@/hooks/useBoss";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BossStatusProps = BaseProps;

/**
 * BossStatus
 * @keit0728
 * @param className Style from parent element
 */
export const BossStatus = ({ className }: BossStatusProps) => {
  const boss = useBossValue();

  if (boss.name === "" || boss.flavor === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "text-justify",
        "mt-[20px]",
        "max-w-[512px]",
        "w-[100%]",
      )}
    >
      <div className={clsx("text-sm", "text-gray-400")}># Name</div>
      <div>{boss.name}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Flavor text</div>
      <div>{boss.flavor}</div>
    </div>
  );
};
