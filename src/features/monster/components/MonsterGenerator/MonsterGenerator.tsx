import { useState } from "react";
import { ListBox } from "@/components/elements/ListBox";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useMonsterController } from "@/hooks/useMonster";
import { useUserValue } from "@/hooks/useUser";
import { languageState } from "@/stores/languageState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState, useSetRecoilState } from "recoil";

let feature = "";
const languages = ["English", "Japanese", "Korean", "Chinese"];
const maxLength = 30;

export type MonsterGeneratorProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterGenerator = ({ className }: MonsterGeneratorProps) => {
  const user = useUserValue();
  const [loading, setLoading] = useState(false);
  const [maxLengthOver, setMaxLengthOver] = useState(false);
  const [language, setLanguage] = useRecoilState(languageState);
  const monsterController = useMonsterController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_countCharacters(e.target.value) <= maxLength) {
      feature = e.target.value;
      if (maxLengthOver) setMaxLengthOver(false);
      return;
    }
    setMaxLengthOver(true);
  };

  const handleClick = async () => {
    if (user.id === "") {
      alert("Please connect your wallet to generate a monster.");
      return;
    }
    if (maxLengthOver) {
      alert(
        "Too many characters.\n\nPlease limit the number of characters to 30 for single-byte characters and 15 for double-byte characters.",
      );
      return;
    }
    setLoading(true);
    try {
      await monsterController.generate(user.id, feature, language);
      setMonsterMinted(false);
    } catch (error) {
      if (error instanceof Error) {
        alert("Invalid monster name.\n\nReason: " + error.message);
      }
      alert("Invalid monster name.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className={clsx(className, "flex", "flex-col", "items-center")}>
      <FeatureInput
        className={clsx("w-[100%]", "h-[40px]", "mb-[20px]")}
        onChange={handleChange}
      />
      <div
        className={clsx(
          "flex",
          "flex",
          "justify-center",
          "items-center",
          "w-[100%]",
        )}
      >
        <ListBox
          className={clsx("w-[80%]")}
          selected={language}
          setSelected={setLanguage}
          list={languages}
        />
        <GenerateButton
          className={clsx("ml-[10px]", "w-[20%]")}
          onClick={handleClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

const _countCharacters = (str: string): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.charCodeAt(i) <= 255 ? 1 : 2;
  }
  return count;
};
