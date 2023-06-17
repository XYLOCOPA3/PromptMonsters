import { ERROR_MAINTENANCE } from "@/const/error";
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
    try {
      await bossController.init(language);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message !== ERROR_MAINTENANCE)
          alert("\n\nReason: " + error.message);
      } else alert("Boss Init Error");
    }
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [language]);

  return <>{children}</>;
};
