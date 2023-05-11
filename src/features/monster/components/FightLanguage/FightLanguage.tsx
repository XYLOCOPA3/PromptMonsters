import { ListBox } from "@/components/elements/ListBox";
import { useLanguageState } from "@/hooks/useLanguage";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

let feature = "";
const languages = ["English", "Japanese"];

export type FightLanguageProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const FightLanguage = ({ className }: FightLanguageProps) => {
  const [language, setLanguage] = useLanguageState();

  return (
    <ListBox
      className={clsx(className)}
      selected={language}
      setSelected={setLanguage}
      list={languages}
    />
  );
};
