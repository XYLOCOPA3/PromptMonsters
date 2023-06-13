import { useState } from "react";
import { DevBBMonsterButton } from "@/dev/components/DevBBMonsterButton";
import { DevBBParamAdj } from "@/dev/components/DevBBParamAdj";
import { DevBBResetButton } from "@/dev/components/DevBBResetButton";
import { DevOnOffButton } from "@/dev/components/DevOnOffButton";
import { devOnOffState } from "@/dev/stores/devOnOffState";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

export type DevComponentsProps = BaseProps;

/**
 * DevComponents
 * @keit0728
 * @param className Style from parent element
 */
export const DevComponents = ({ className }: DevComponentsProps) => {
  const [isDev, setIsDev] = useState(false);
  const devOnOff = useRecoilValue(devOnOffState);

  useLayoutEffectOfSSR(() => {
    setIsDev(process.env.NEXT_PUBLIC_IS_PRODUCTION === "false");
  }, []);

  if (!isDev) return <></>;
  if (!devOnOff)
    return (
      <div
        className={clsx(
          className,
          "fixed",
          "top-[10%]",
          "left-[20px]",
          "p-[5px]",
          "cursor-pointer",
          "z-[100]",
          "flex",
          "flex-col",
        )}
      >
        <DevOnOffButton />
      </div>
    );
  return (
    <div
      className={clsx(
        className,
        "fixed",
        "top-[10%]",
        "left-[20px]",
        "p-[5px]",
        "cursor-pointer",
        "z-[100]",
        "flex",
        "flex-col",
        "bg-gray-800",
      )}
    >
      <div className={clsx("flex")}>
        <DevOnOffButton />
        <DevBBResetButton />
        <DevBBMonsterButton />
      </div>
      <DevBBParamAdj />
    </div>
  );
};
