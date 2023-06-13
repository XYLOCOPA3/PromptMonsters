import Image from "next/image";
import { useBossValue } from "@/hooks/useBoss";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BossImageProps = BaseProps;

/**
 * BossImage
 * @keit0728
 * @param className Style from parent element
 */
export const BossImage = ({ className }: BossImageProps) => {
  const boss = useBossValue();

  if (boss.imageURL === "") return <></>;
  return (
    <Image
      className={clsx(
        className,
        "rounded-2xl",
        "w-[300px]",
        "h-auto",
        "md:w-[450px]",
      )}
      src={boss.imageURL}
      alt="boss"
      width={512}
      height={512}
    />
  );
};
