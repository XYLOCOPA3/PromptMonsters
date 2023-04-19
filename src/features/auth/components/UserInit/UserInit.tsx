import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { userInitState } from "@/stores/userInitState";
import { BaseProps } from "@/types/BaseProps";
import { useSetRecoilState } from "recoil";

export type UserInitProps = BaseProps;

/**
 * Initialize user
 * @feature
 * @keit0728
 * @param children Children
 */
export const UserInit = ({ children }: UserInitProps) => {
  const setUserInit = useSetRecoilState(userInitState);

  /**
   * 初期化
   */
  const init = async () => {
    try {
    } catch (e) {
      console.error(e);
      alert("ログインに失敗しました。");
    }
    setUserInit(true);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, []);

  return <>{children}</>;
};
