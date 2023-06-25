import Image from "next/image";
import { useMintedBossValue } from "@/hooks/useMintedBoss";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MintedBossImageProps = BaseProps;

/**
 * MintedBossImage
 * @keit0728
 * @param className Style from parent element
 */
export const MintedBossImage = ({ className }: MintedBossImageProps) => {
  const mintedBoss = useMintedBossValue();

  if (mintedBoss.imageURL === "") return <></>;
  return (
    <Image
      className={clsx(className, "rounded-2xl")}
      src={mintedBoss.imageURL}
      alt="boss"
      width={512}
      height={512}
    />
  );
};
