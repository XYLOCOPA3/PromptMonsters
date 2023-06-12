import { useBossController } from "@/hooks/useBoss";
import { useLanguageValue } from "@/hooks/useLanguage";
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
  const language = useLanguageValue();

  const init = async () => {
    if (language === "") return;
    await bossController.init(language);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [language]);

  return <>{children}</>;
};
