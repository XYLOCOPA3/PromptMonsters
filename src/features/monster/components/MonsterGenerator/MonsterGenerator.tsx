import { useState } from "react";
import { Warning } from "@/components/elements/Warning";
import { ERROR_MAINTENANCE } from "@/const/error";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useBattleController } from "@/hooks/useBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterController } from "@/hooks/useMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { useSetSelectedMonsterIdNameState } from "@/hooks/useSelectedMonsterIdName";
import { disableState } from "@/stores/disableState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

let feature = "";

export type MonsterGeneratorProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterGenerator = ({ className }: MonsterGeneratorProps) => {
  const language = useLanguageValue();
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const setDisable = useSetRecoilState(disableState);
  const setSelectedMonsterIdName = useSetSelectedMonsterIdNameState();
  const [loading, setLoading] = useState(false);
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const { t: tCommon } = useTranslation("common");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    feature = e.target.value;
  };

  const handleClick = async () => {
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
        if (error.message !== ERROR_MAINTENANCE)
          alert("Invalid feature.\n\nReason: " + error.message);
        console.error(error);
        return;
      }
      alert("Invalid feature.");
      console.error(error);
      return;
    }
    setLoading(false);
    setDisable(false);
  };

  return (
    <div className={clsx(className, "flex", "flex-col", "items-center")}>
      <div
        className={clsx("flex", "justify-center", "items-center", "w-[100%]")}
      >
        <Warning className={clsx("mr-[5px]")} hintText={tCommon("warning")} />
        <FeatureInput
          className={clsx("w-[100%]", "h-[40px]")}
          onChange={handleChange}
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
