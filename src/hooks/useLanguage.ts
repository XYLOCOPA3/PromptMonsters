import { useCallback, useEffect } from "react";
import { LanguageState, languageState } from "@/stores/languageState";
import { useRecoilState, useSetRecoilState } from "recoil";

// ローカルストレージのキー名
const STORAGE_KEY_LANGUAGE = "prompt-monsters.com/language";

export const useLanguageValue = (): LanguageState => {
  const [language, setLanguageInternal] = useRecoilState(languageState);

  // クライアントでの初期レンダリング直後にローカルストレージの設定を反映
  useEffect(() => {
    const prevLanguage =
      localStorage.getItem(STORAGE_KEY_LANGUAGE) ?? "English";
    setLanguageInternal(prevLanguage);
  }, [setLanguageInternal]);

  return language;
};

export const useSetLanguageState = (): ((language: string) => void) => {
  const setLanguageInternal = useSetRecoilState(languageState);

  // 外部からのセッター呼び出し時にローカルストレージに値を保存する
  const setLanguage = useCallback(
    (language: string) => {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, language);
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