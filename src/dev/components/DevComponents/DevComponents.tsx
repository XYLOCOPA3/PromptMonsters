import { useState } from "react";
import { DevBBKParamAdj } from "@/dev/components/DevBBKParamAdj";
import { DevBBMonsterButton } from "@/dev/components/DevBBMonsterButton";
import { DevBBResetButton } from "@/dev/components/DevBBResetButton";
import { DevOnOffButton } from "@/dev/components/DevOnOffButton";
import { devOnOffState } from "@/dev/stores/devOnOffState";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { BaseProps } from "@/types/BaseProps";
import axios from "axios";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

export type DevComponentsProps = BaseProps;

/**
 * DevComponents
 * @keit0728
 * @param className Style from parent element
 */
export const DevComponents = ({ className }: DevComponentsProps) => {
  const devOnOff = useRecoilValue(devOnOffState);
  const [isDev, setIsDev] = useState(false);

  const checkDev = async () => {
    let res: any;
    try {
      res = await axios.post("/api/get-stage");
    } catch (e) {
      console.error(e);
    }
    const stage = res.data.stage;
    setIsDev(stage === "develop");
  };

  useLayoutEffectOfSSR(() => {
    checkDev();
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
      <DevBBKParamAdj />
    </div>
  );
};
