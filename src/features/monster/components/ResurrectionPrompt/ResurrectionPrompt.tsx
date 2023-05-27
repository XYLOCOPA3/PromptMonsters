import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/elements/Button";
import { Hint } from "@/components/elements/Hint";
import { useBattleController } from "@/hooks/useBattle";
import { useMonsterController } from "@/hooks/useMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { useSetSelectedMonsterIdNameState } from "@/hooks/useSelectedMonsterIdName";
import { disableState } from "@/stores/disableState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";

let resurrectionPrompt = "";

export type ResurrectionPromptProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const ResurrectionPrompt = ({ className }: ResurrectionPromptProps) => {
  const [loading, setLoading] = useState(false);
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const [disable, setDisable] = useRecoilState(disableState);
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const setSelectedMonsterIdName = useSetSelectedMonsterIdNameState();
  const { t: tCommon } = useTranslation("common");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resurrectionPrompt = e.target.value;
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
      const newMonster = await monsterController.resurrect(resurrectionPrompt);
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
        alert("Invalid Resurrection Prompt.\n\nReason: " + error.message);
        console.error(error);
        return;
      }
      alert("Invalid Resurrection Prompt.");
      console.error(error);
      return;
    }
    setLoading(false);
    setDisable(false);
  };

  return (
    <div className={clsx(className, "flex", "justify-center", "items-center")}>
      <Hint className={clsx("mr-[5px]")} hintText={tCommon("hint")} />
      <input
        className={clsx(
          "w-[80%]",
          "h-[40px]",
          "bg-gray-700",
          "px-2",
          "rounded-lg",
        )}
        type="text"
        name="name"
        placeholder="Resurrection Prompt"
        autoComplete="off"
        onChange={handleChange}
      />
      <Button
        className={clsx(
          "ml-[10px]",
          "w-[20%]",
          "h-[40px]",
          "flex",
          "justify-center",
          "items-center",
        )}
        disabled={disable}
        variant="secondary"
        loading={loading}
        onClick={handleClick}
      >
        <Image
          className={clsx("w-[30px]", "h-[30px]")}
          src="/assets/images/savings_white_24dp.svg"
          alt="resurrection-prompt-icon"
          width={50}
          height={50}
        />
      </Button>
    </div>
  );
};
