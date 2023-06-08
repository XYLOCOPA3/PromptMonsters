import { useBossController } from "@/hooks/useBoss";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { BaseProps } from "@/types/BaseProps";

export type BossInitProps = BaseProps;

/**
 * Boss monster init
 * @keit0728
 * @param children Children
 */
export const BossInit = ({ children }: BossInitProps) => {
  const bossController = useBossController();

  const init = async () => {
    await bossController.init();
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, []);

  return <>{children}</>;
};
