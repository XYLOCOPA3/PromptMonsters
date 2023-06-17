import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Language } from "@/components/elements/Language";
import { LANGUAGES } from "@/const/language";
import { LoginButton } from "@/features/auth";
import { MyShortProfile } from "@/features/profile";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useUserValue } from "@/hooks/useUser";
import { drawerOpenState } from "@/stores/drawerOpenState";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

/**
 * Header
 * @keit0728
 */
export const Header = () => {
  const user = useUserValue();
  const language = useLanguageValue();
  const { push, pathname, asPath } = useRouter();
  const { t: tCommon } = useTranslation("common");
  const setDrawerOpen = useSetRecoilState(drawerOpenState);

  const handleClick = () => {
    setDrawerOpen(true);
  };

  useLayoutEffectOfSSR(() => {
    switch (language) {
      case LANGUAGES[0]:
        push(pathname, undefined, { locale: "en" });
        break;
      case LANGUAGES[1]:
        push(pathname, asPath, { locale: "ja" });
        break;
      default:
        break;
    }
  }, [language]);

  return (
    <header className={clsx("fixed", "w-[100%]", "top-0", "z-[10]")}>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-between",
          "m-[10px]",
          "bg-[#292B2F]",
          "bg-opacity-[80%]",
          "rounded-[50px]",
        )}
      >
        <div className={clsx("flex", "items-center")}>
          <Link
            className={clsx(
              "flex",
              "items-center",
              "hidden",
              "md:inline-block",
            )}
            href="/"
          >
            <Image
              className={clsx("ml-[20px]", "my-[10px]", "w-[40px]", "h-[40px]")}
              src="/assets/images/prompt-monsters-icon.svg"
              alt="prompt-monsters-icon"
              width={100}
              height={100}
            />
          </Link>
          <Link
            className={clsx("flex", "items-center", "md:hidden")}
            href=""
            onClick={handleClick}
          >
            <Image
              className={clsx("ml-[10px]", "my-[10px]", "w-[40px]", "h-[40px]")}
              src="/assets/images/prompt-monsters-icon.svg"
              alt="prompt-monsters-icon"
              width={100}
              height={100}
            />
          </Link>
          <Link
            className={clsx(
              "ml-[30px]",
              "font-bold",
              "hidden",
              "md:inline-block",
            )}
            href="/monsters"
          >
            {tCommon("generate")}
          </Link>
          <Link
            className={clsx(
              "ml-[30px]",
              "font-bold",
              "hidden",
              "md:inline-block",
            )}
            href="/boss"
          >
            {tCommon("boss")}
          </Link>
        </div>
        <div className={clsx("flex", "items-center")}>
          <Language className={clsx("mr-[10px]")} />
          {user.freePlay ? (
            <LoginButton className={clsx("mr-[4px]", "md:mr-[20px]")} />
          ) : (
            <MyShortProfile className={clsx("mr-[4px]", "md:mr-[20px]")} />
          )}
        </div>
      </div>
    </header>
  );
};
