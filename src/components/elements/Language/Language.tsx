import { ListBox } from "@/components/elements/ListBox";
import { LANGUAGES } from "@/const/language";
import { useLanguageState } from "@/hooks/useLanguage";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type LanguageProps = BaseProps;

/**
 * Language selector
 * @keit0728
 * @param className Style from parent element
 */
export const Language = ({ className }: LanguageProps) => {
  const [language, setLanguage] = useLanguageState();

  return (
    <ListBox
      className={clsx(className)}
      selected={language}
      setSelected={setLanguage}
      list={LANGUAGES}
    />
  );
};
