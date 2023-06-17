import { useCallback, useEffect } from "react";
import { LANGUAGES } from "@/const/language";
import { LanguageState, languageState } from "@/stores/languageState";
import { useRecoilState, useSetRecoilState } from "recoil";

// ローカルストレージのキー名
const STORAGE_KEY_LANGUAGE = "prompt-monsters.com/language";

export const useLanguageValue = (): LanguageState => {
  const [language, setLanguageInternal] = useRecoilState(languageState);

  // クライアントでの初期レンダリング直後にローカルストレージの設定を反映
  useEffect(() => {
    let prevLocale = localStorage.getItem(STORAGE_KEY_LANGUAGE) ?? "English";
    if (!LANGUAGES.includes(prevLocale)) prevLocale = "English";
    setLanguageInternal(prevLocale);
  }, [setLanguageInternal]);

  return language;
};

export const useSetLanguageState = (): ((language: string) => void) => {
  const setLanguageInternal = useSetRecoilState(languageState);

  // 外部からのセッター呼び出し時にローカルストレージに値を保存する
  const setLanguage = useCallback(
    (locale: string) => {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, locale);
      setLanguageInternal(locale);
    },
    [setLanguageInternal],
  );

  return setLanguage;
};

export const useLanguageState = (): [
  LanguageState,
  (language: string) => void,
] => [useLanguageValue(), useSetLanguageState()];
