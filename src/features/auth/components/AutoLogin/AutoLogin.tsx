import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useUserController } from "@/hooks/useUser";
import { BaseProps } from "@/types/BaseProps";
import { useAccount, useNetwork } from "wagmi";

export type AutoLoginProps = BaseProps;

/**
 * Initialize user
 * @keit0728
 * @param children Children
 */
export const AutoLogin = ({ children }: AutoLoginProps) => {
  const { address } = useAccount();
  const userController = useUserController();
  const { chain } = useNetwork();

  /**
   * 初期化
   */
  const init = () => {
    if (address === undefined) return;
    userController.set(address!, false);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [address, chain]);

  return <>{children}</>;
};
