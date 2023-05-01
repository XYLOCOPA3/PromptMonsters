import { useState } from "react";
import Link from "next/link";
import { GenerateButton } from "@/features/monster";
import { LanguageSwitch } from "@/features/note/components/LanguageSwitch";
import { useMintPriceValue } from "@/hooks/useMintPrice";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type PlayNoteProps = BaseProps;

/**
 * Monster battle tweet button
 * @keit0728
 * @param className Style from parent element
 */
export const PlayNote = ({ className }: PlayNoteProps) => {
  const mintPrice = useMintPriceValue();
  const [language, setLanguage] = useState<"EN" | "JP">("EN");

  const handleClick = () => {
    if (language === "EN") {
      setLanguage("JP");
    } else {
      setLanguage("EN");
    }
  };

  return (
    <div
      className={clsx(
        className,
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "text-justify",
      )}
    >
      <div className={clsx("flex", "justify-between")}>
        <div className={clsx("font-bold", "text-[24px]", "mb-[20px]")}>
          {language === "EN" ? "# How to Play" : "# 遊び方"}
        </div>
        <LanguageSwitch className={clsx("w-[60px]")} onClick={handleClick}>
          {language}
        </LanguageSwitch>
      </div>
      <ol className={clsx("list-decimal", "list-outside", "pl-6", "mb-[30px]")}>
        <li className={clsx("mb-2")}>
          {language === "EN"
            ? "First, enter the desired features of the monster you want."
            : "最初に欲しいモンスターの特徴を入力します。"}
        </li>
        <li className={clsx("mb-2")}>
          {language === "EN"
            ? "Press this button to generate monster status based on the entered features."
            : "下のボタンを押すと、入力した特徴を元にモンスターのステータスを自動で生成します。"}
          <GenerateButton
            className={clsx("w-[60px]", "my-[10px]")}
            onClick={() => {}}
          />
        </li>
        <li className={clsx("mb-2")}>
          {language === "EN"
            ? "You can have this monster battle against other monsters."
            : "このモンスターは他のモンスターと戦わせることができます。"}
        </li>
      </ol>
      <div className={clsx("mb-2")}>
        {language === "EN"
          ? `Additionally, you can convert the monster into an NFT by paying ${
              mintPrice === 0 ? "" : mintPrice
            } MCHC.`
          : `また、このモンスターは${
              mintPrice === 0 ? "" : mintPrice
            } MCHCを支払ってNFTに変換することができます。`}
      </div>
      <div className={clsx("mb-2")}>
        {language === "EN"
          ? `Converting to an NFT allows you to save the monster's battle record and participate in campaigns.`
          : `NFTに変換すると、モンスターの戦績を保存したり、キャンペーンに参加することができます。`}
      </div>
      <br />
      <div className={clsx("mb-2", "font-bold")}>
        {language === "EN"
          ? `Details of the 10 OAS per mint giveaway and the 5,300 OAS season ranking campaign can be found below ↓`
          : `1ミントあたり10 OAS貰えるキャンペーンや、総額5,300 OASのランキングキャンペーンの詳細はこちら↓`}
      </div>
      <Link
        className={clsx("mb-2", "text-blue-500", "hover:underline")}
        href={
          language === "EN"
            ? "https://promptmonsters.substack.com/p/ai-powered-blockchain-game-prompt"
            : "https://prtimes.jp/main/html/rd/p/000000009.000107796.html"
        }
      >
        {language === "EN"
          ? `https://promptmonsters.substack.com/p/ai-powered-blockchain-game-prompt`
          : `https://prtimes.jp/main/html/rd/p/000000009.000107796.html`}
      </Link>
      <br />
      <br />
      <div className={clsx("mb-2")}>
        {language === "EN"
          ? "In the future, we plan to make NFT-converted monsters usable in other BCGs, so please mint your monster and enjoy!"
          : "今後、NFTに変換したモンスターを他のBCGでも使用できるようにする予定ですので、ぜひモンスターをMintしてお楽しみください！"}
      </div>
    </div>
  );
};
