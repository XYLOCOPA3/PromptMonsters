import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MainProps = BaseProps;

/**
 * Main
 * @layout
 * @keit0728
 * @param children Children elements
 */
export const Main = ({ children }: MainProps) => {
  return <main className={clsx("overflow-y-scroll")}>{children}</main>;
};
