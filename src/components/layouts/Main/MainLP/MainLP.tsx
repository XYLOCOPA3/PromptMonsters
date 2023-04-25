import {
  ContactUs,
  Features,
  LatestNews,
  OurPartner,
  Top,
  TwitterIcon,
} from "@/features/lp";
import { Futures } from "@/features/lp/components/Futures";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MainLPProps = BaseProps;

/**
 * MainLP
 * @keit0728
 * @param className Style from parent element
 */
export const MainLP = ({ className }: MainLPProps) => {
  return (
    <div className={clsx(className, "flex", "flex-col", "items-center")}>
      <TwitterIcon />
      <Top />
      <Features />
      <Futures />
      <OurPartner />
      <LatestNews />
      <ContactUs />
    </div>
  );
};
