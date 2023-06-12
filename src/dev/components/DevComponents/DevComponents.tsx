import { useState } from "react";
import { DevBBMonsterButton } from "@/dev/components/DevBBMonsterButton";
import { DevBBResetButton } from "@/dev/components/DevBBResetButton";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type DevComponentsProps = BaseProps;

/**
 * DevComponents
 * @keit0728
 * @param className Style from parent element
 */
export const DevComponents = ({ className }: DevComponentsProps) => {
  const [isDev, setIsDev] = useState(false);

  useLayoutEffectOfSSR(() => {
    setIsDev(process.env.NEXT_PUBLIC_IS_PRODUCTION === "false");
  }, []);

  if (!isDev) return <></>;
  return (
    <div
      className={clsx(
        className,
        "fixed",
        "top-[10%]",
        "left-[20px]",
        "p-[5px]",
        "cursor-pointer",
        "z-[1]",
        "flex",
        "flex-col",
      )}
    >
      <DevBBResetButton />
      <DevBBMonsterButton />
    </div>
  );
};
