import { useState } from "react";
import { ListBox } from "@/components/elements/ListBox";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useBattleController } from "@/hooks/useBattle";
import { useMonsterController } from "@/hooks/useMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { useUserValue } from "@/hooks/useUser";
import { disableState } from "@/stores/disableState";
import { languageState } from "@/stores/languageState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { selectedMonsterIdNameState } from "@/stores/selectedMonsterIdNameState";
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
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const setDisable = useSetRecoilState(disableState);
  const setSelectedMonsterIdName = useSetRecoilState(
    selectedMonsterIdNameState,
  );

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
    setDisable(true);
    setLoading(true);
    try {
      const newMonster = await monsterController.generate(
        user.id,
        feature,
        language,
      );
      const lastMonsterIndex = ownedMonsters.length - 1;
      if (lastMonsterIndex === -1) {
        ownedMonstersController.add(newMonster);
      } else {
        if (ownedMonsters[lastMonsterIndex].id !== "") {
          ownedMonstersController.add(newMonster);
        } else {
          ownedMonstersController.update(lastMonsterIndex, newMonster);
        }
      }
      setSelectedMonsterIdName(`${newMonster.name} | ${newMonster.id}`);
      setMonsterMinted(false);
    } catch (error) {
      setLoading(false);
      setDisable(false);
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
    setDisable(false);
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
