import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/elements/Button";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import axios from "axios";
import clsx from "clsx";

export type DevBBResetButtonProps = BaseProps;

/**
 * DevBBResetButton
 * @keit0728
 * @param className Style from parent element
 */
export const DevBBResetButton = ({ className }: DevBBResetButtonProps) => {
  const monster = useMonsterValue();
  const [loading, setLoading] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const { push } = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await axios.post("/api/boss/dev/reset", {
      resurrectionPrompt: monster.resurrectionPrompt,
    });
    setLoading(false);
    push("/boss");
  };

  useLayoutEffectOfSSR(() => {
    setIsDev(process.env.NEXT_PUBLIC_IS_PRODUCTION === "false");
  }, []);

  if (!isDev) return <></>;
  return (
    <Button
      className={clsx(
        className,
        "fixed",
        "top-[10%]",
        "left-[20px]",
        "p-[5px]",
        "cursor-pointer",
        "z-[1]",
      )}
      onClick={handleClick}
      loading={loading}
    >
      BBリセット
    </Button>
  );
};
