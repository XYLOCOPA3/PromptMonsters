import { useCallback, useEffect } from "react";
import { LanguageState, languageState } from "@/stores/languageState";
import { getCookie, setCookie } from "cookies-next";
import { useRecoilState, useSetRecoilState } from "recoil";

export const useLanguageValue = (): LanguageState => {
  const [language, setLanguageInternal] = useRecoilState(languageState);

  useEffect(() => {
    const nextLocale = getCookie("NEXT_LOCALE");
    let prevLanguage = "";
    switch (nextLocale) {
      case "en":
        prevLanguage = "English";
        break;
      case "ja":
        prevLanguage = "日本語";
        break;
      default:
        setCookie("NEXT_LOCALE", "en");
        prevLanguage = "English";
        break;
    }
    setLanguageInternal(prevLanguage);
  }, [setLanguageInternal]);

  return language;
};

export const useSetLanguageState = (): ((language: string) => void) => {
  const setLanguageInternal = useSetRecoilState(languageState);

  const setLanguage = useCallback(
    (language: string) => {
      setCookie("NEXT_LOCALE", language === "日本語" ? "ja" : "en");
      setLanguageInternal(language);
    },
    [setLanguageInternal],
  );

  return setLanguage;
};

export const useLanguageState = (): [
  LanguageState,
  (language: string) => void,
] => [useLanguageValue(), useSetLanguageState()];
