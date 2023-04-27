import { useState } from "react";
import { ListBox } from "@/components/elements/ListBox";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useBattleController } from "@/hooks/useBattle";
import { useMonsterController } from "@/hooks/useMonster";
import { useUserValue } from "@/hooks/useUser";
import { languageState } from "@/stores/languageState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import { countCharacters } from "@/utils/charUtils";
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
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (countCharacters(e.target.value) <= maxLength) {
      feature = e.target.value;
      if (maxLengthOver) setMaxLengthOver(false);
      return;
    }
    setMaxLengthOver(true);
  };

  const handleClick = async () => {
    battleController.reset();
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
      setLoading(false);
      if (error instanceof Error) {
        alert("Invalid monster name.\n\nReason: " + error.message);
        console.error(error);
        return;
      }
      alert("Invalid monster name.");
      console.error(error);
      return;
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
