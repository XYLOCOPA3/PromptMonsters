import { Background } from "@/components/elements/Background";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type MainMaintenanceProps = BaseProps;

/**
 * MainMaintenance
 * @keit0728
 * @param className Style from parent element
 */
export const MainMaintenance = ({ className }: MainMaintenanceProps) => {
  const { t: tMaintenance } = useTranslation("maintenance");

  return (
    <>
      <Background
        className={clsx("opacity-10")}
        src="/assets/images/bg-arena.png"
      />
      <div
        className={clsx(
          className,
          "flex",
          "items-center",
          "justify-center",
          "h-screen",
        )}
      >
        <div className={clsx("font-bold", "text-[24px]", "md:text-[48px]")}>
          {tMaintenance("maintenance")}
        </div>
      </div>
    </>
  );
};
