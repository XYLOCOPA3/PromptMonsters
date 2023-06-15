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
    await bossEventController.init();
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, []);

  return <>{children}</>;
};
