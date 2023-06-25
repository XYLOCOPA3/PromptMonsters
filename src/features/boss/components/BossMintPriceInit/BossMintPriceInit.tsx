import { useBossMintPriceController } from "@/hooks/useBossMintPrice";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { BaseProps } from "@/types/BaseProps";

export type BossMintPriceInitProps = BaseProps;

/**
 * BossMintPriceInit
 * @keit0728
 * @param children Children
 */
export const BossMintPriceInit = ({ children }: BossMintPriceInitProps) => {
  const bossMintPriceController = useBossMintPriceController();

  const init = async () => {
    try {
      await bossMintPriceController.init();
    } catch (error) {
      console.error(error);
    }
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, []);

  return <>{children}</>;
};
