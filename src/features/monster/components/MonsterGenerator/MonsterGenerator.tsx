import { useState } from "react";
import { ListBox } from "@/components/elements/ListBox";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useBattleController } from "@/hooks/useBattle";
import { useLanguageState } from "@/hooks/useLanguage";
import { useMonsterController } from "@/hooks/useMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { disableState } from "@/stores/disableState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { selectedMonsterIdNameState } from "@/stores/selectedMonsterIdNameState";
import { BaseProps } from "@/types/BaseProps";
import { countCharactersForGenerator } from "@/utils/charUtils";
import clsx from "clsx";
import { useSetRecoilState } from "recoil";

let feature = "";
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
  const [language, setLanguage] = useLanguageState();
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
      <div
        className={clsx(
          "flex",
          "justify-center",
          "items-center",
          "mb-[20px]",
          "w-[100%]",
        )}
      >
        {/* <Warning
          className={clsx("mr-[5px]")}
          hintText={`Warning: In this game, the use of monsters with features that manipulate status illegitimately or violate public morals and ethics is strictly prohibited. If such a monster is used, there is a possibility of account suspension or permanent banishment. We appreciate your understanding and cooperation.\n\n警告：当ゲームにおいて、ステータスを不正に操作する特徴や公俗良序に反する特徴を持つモンスターの使用は固く禁止されています。もし、このようなモンスターを使用した場合、アカウント停止や永久追放の処分を受ける可能性があります。お客様のご理解とご協力をお願い致します。`}
        /> */}
        <FeatureInput
          className={clsx("w-[100%]", "h-[40px]")}
          onChange={handleChange}
        />
      </div>
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
