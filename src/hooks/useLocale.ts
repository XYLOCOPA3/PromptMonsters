import { useCallback, useEffect } from "react";
import { LocaleState, localeState } from "@/stores/localeState";
import { useRecoilState, useSetRecoilState } from "recoil";

// ローカルストレージのキー名
const STORAGE_KEY_LOCALE = "prompt-monsters.com/locale";

export const useLocaleValue = (): LocaleState => {
  const [locale, setLocaleInternal] = useRecoilState(localeState);

  // クライアントでの初期レンダリング直後にローカルストレージの設定を反映
  useEffect(() => {
    const prevLocale = localStorage.getItem(STORAGE_KEY_LOCALE) ?? "en";
    setLocaleInternal(prevLocale);
  }, [setLocaleInternal]);

  return locale;
};

export const useSetLocaleState = (): ((locale: string) => void) => {
  const setLocaleInternal = useSetRecoilState(localeState);

  // 外部からのセッター呼び出し時にローカルストレージに値を保存する
  const setLocale = useCallback(
    (locale: string) => {
      localStorage.setItem(STORAGE_KEY_LOCALE, locale);
      setLocaleInternal(locale);
    },
    [setLocaleInternal],
  );

  return setLocale;
};

export const useLocaleState = (): [LocaleState, (locale: string) => void] => [
  useLocaleValue(),
  useSetLocaleState(),
];
