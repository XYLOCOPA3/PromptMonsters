import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMintPriceController } from "@/hooks/useMintPrice";
import { BaseProps } from "@/types/BaseProps";

export type MonsterMintPriceInitProps = BaseProps;

/**
 * Monster mint price fetcher
 * @keit0728
 * @param children Children
 */
export const MonsterMintPriceInit = ({
  children,
}: MonsterMintPriceInitProps) => {
  const mintPriceController = useMintPriceController();

  const init = async () => {
    try {
      await mintPriceController.init();
    } catch (error) {
      console.error(error);
    }
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, []);

  return <>{children}</>;
};
