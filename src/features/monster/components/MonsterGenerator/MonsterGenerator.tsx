import { useState } from "react";
import { ListBox } from "@/components/elements/ListBox";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useBattleController } from "@/hooks/useBattle";
import { useMonsterController } from "@/hooks/useMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { disableState } from "@/stores/disableState";
import { languageState } from "@/stores/languageState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { selectedMonsterIdNameState } from "@/stores/selectedMonsterIdNameState";
import { BaseProps } from "@/types/BaseProps";
import { countCharactersForGenerator } from "@/utils/charUtils";
import clsx from "clsx";
import { useRecoilState, useSetRecoilState } from "recoil";

let feature = "";
// const languages = ["English", "Japanese", "Korean", "Chinese"];
const languages = ["English", "Japanese"];
const maxLength = 45;

export type MonsterGeneratorProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterGenerator = ({ className }: MonsterGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [maxLengthOver, setMaxLengthOver] = useState(false);
  const [language, setLanguage] = useRecoilState(languageState);
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const setDisable = useSetRecoilState(disableState);
  const setSelectedMonsterIdName = useSetRecoilState(
    selectedMonsterIdNameState,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (countCharactersForGenerator(e.target.value) <= maxLength) {
      feature = e.target.value;
      if (maxLengthOver) setMaxLengthOver(false);
      return;
    }
    setMaxLengthOver(true);
  };

  const handleClick = async () => {
    if (maxLengthOver) {
      alert(
        `Too many characters.\n\nPlease limit the number of characters to ${maxLength} for single-byte characters and ${
          maxLength / 3
        } for double-byte characters.`,
      );
      return;
    }
    let hasNotMintedMonster = false;
    for (let i = 0; i < ownedMonsters.length; i++) {
      if (ownedMonsters[i].id !== "") continue;
      hasNotMintedMonster = true;
      break;
    }
    //     if (hasNotMintedMonster) {
    //       if (
    //         !confirm(
    //           `Did you take note of the "Resurrection Prompt"?

    // When you execute "Monster Generation," any unminted monsters will disappear.
    // But don't worry. By entering the "Resurrection Prompt," you can regenerate them.
    // Please be careful, as if you forget to note down the "Resurrection Prompt," you won't be able to regenerate the monsters.
    // NOTE: Once minted, entering the "Resurrection Prompt" will not regenerate the monster.

    // Do you want to proceed with "Monster Generation"?`,
    //         )
    //       )
    //         return;
    //     }
    battleController.reset();
    setDisable(true);
    setLoading(true);
    try {
      const newMonster = await monsterController.generate(feature, language);
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
      setSelectedMonsterIdName(`${newMonster.name} | id: ${newMonster.id}`);
      setMonsterMinted(false);
    } catch (error) {
      setLoading(false);
      setDisable(false);
      if (error instanceof Error) {
        alert("Invalid monster name.\n\nReason: " + error.message);
        // console.error(error);
        // console.log(error);
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
          className={clsx("w-[80%]", "z-[1]")}
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
