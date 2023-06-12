import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import axios from "axios";
import clsx from "clsx";

export type DevButtonProps = BaseProps;

/**
 * DevButton
 * @keit0728
 * @param className Style from parent element
 */
export const DevButton = ({ className }: DevButtonProps) => {
  const monster = useMonsterValue();
  const [loading, setLoading] = useState(false);
  const [isDev, setIsDev] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await axios.post("/api/boss/end", {
      resurrectionPrompt: monster.resurrectionPrompt,
    });
    setLoading(false);
  };

  useLayoutEffectOfSSR(() => {
    setIsDev(process.env.NEXT_PUBLIC_IS_PRODUCTION === "false");
  }, []);

  // if (!isDev) return <></>;
  return (
    <Button
      className={clsx(
        className,
        "fixed",
        "top-[10%]",
        "left-0",
        "m-4",
        "w-8",
        "h-8",
        "cursor-pointer",
        "z-[1]",
      )}
      onClick={handleClick}
      loading={loading}
    >
      dev
    </Button>
  );
};
