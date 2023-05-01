import { ListBox } from "@/components/elements/ListBox";
import { languageState } from "@/stores/languageState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState } from "recoil";

let feature = "";
const languages = ["English", "Japanese"];

export type FightLanguageProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const FightLanguage = ({ className }: FightLanguageProps) => {
  const [language, setLanguage] = useRecoilState(languageState);

  return (
    <ListBox
      className={clsx(className)}
      selected={language}
      setSelected={setLanguage}
      list={languages}
    />
  );
};
