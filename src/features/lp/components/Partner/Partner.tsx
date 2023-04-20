import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type PartnerProps = BaseProps;

/**
 * Partner
 * @keit0728
 * @param className Style from parent element
 */
export const Partner = ({ className }: PartnerProps) => {
  return (
    <div className={clsx(className, "w-[100%]")}>
      <div
        className={clsx("ml-[30px]", "mb-[50px]", "font-bold", "text-[40px]")}
      >
        Partner
      </div>
      <div className={clsx("font-bold", "text-[20px]", "text-center")}>
        Coming soon...
      </div>
    </div>
  );
};
