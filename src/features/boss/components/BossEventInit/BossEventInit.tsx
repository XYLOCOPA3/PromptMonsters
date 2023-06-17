import { ERROR_MAINTENANCE } from "@/const/error";
import { useBossEventController } from "@/hooks/useBossEvent";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { BaseProps } from "@/types/BaseProps";

export type BossEventInitProps = BaseProps;

/**
 * BossEventInit
 * @keit0728
 * @param children Children
 */
export const BossEventInit = ({ children }: BossEventInitProps) => {
  const bossEventController = useBossEventController();

  const init = async () => {
    try {
      await bossEventController.init();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message !== ERROR_MAINTENANCE)
          alert("Boss Event Init Error" + "\n\nReason: " + error.message);
      } else alert("Boss Event Init Error");
    }
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, []);

  return <>{children}</>;
};
