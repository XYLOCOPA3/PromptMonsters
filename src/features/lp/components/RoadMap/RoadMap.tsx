import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type RoadMapProps = BaseProps;

/**
 * RoadMap
 * @keit0728
 * @param className Style from parent element
 */
export const RoadMap = ({ className }: RoadMapProps) => {
  return (
    <div className={clsx(className)}>
      <div
        className={clsx("ml-[30px]", "mb-[50px]", "font-bold", "text-[40px]")}
      >
        Road Map
      </div>
      <Image
        className={clsx()}
        src="/assets/images/roadmap.svg"
        alt="roadmap"
        width={1266}
        height={563}
      />
    </div>
  );
};
