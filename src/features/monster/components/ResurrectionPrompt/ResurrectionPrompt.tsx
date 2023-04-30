import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/elements/Button";
import { useBattleController } from "@/hooks/useBattle";
import { useMonsterController } from "@/hooks/useMonster";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { useUserState } from "@/hooks/useUser";
import { disableState } from "@/stores/disableState";
import { languageState } from "@/stores/languageState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { selectedMonsterIdNameState } from "@/stores/selectedMonsterIdNameState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState, useSetRecoilState } from "recoil";

let resurrectionPrompt = "";

export type ResurrectionPromptProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const ResurrectionPrompt = ({ className }: ResurrectionPromptProps) => {
  const [user, userController] = useUserState();
  const [loading, setLoading] = useState(false);
  const [maxLengthOver, setMaxLengthOver] = useState(false);
  const [language, setLanguage] = useRecoilState(languageState);
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const monsterController = useMonsterController();
  const battleController = useBattleController();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const [disable, setDisable] = useRecoilState(disableState);
  const setSelectedMonsterIdName = useSetRecoilState(
    selectedMonsterIdNameState,
  );

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
    if (hasNotMintedMonster) {
      if (
        !confirm(
          `Did you take note of the "Resurrection Prompt"?

When you execute "Monster Generation," any unminted monsters will disappear.
But don't worry. By entering the "Resurrection Prompt," you can regenerate them.
Please be careful, as if you forget to note down the "Resurrection Prompt," you won't be able to regenerate the monsters.
NOTE: Once minted, entering the "Resurrection Prompt" will not regenerate the monster.

Do you want to proceed with "Monster Generation"?`,
        )
      )
        return;
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
    <div className={clsx(className, "flex", "justify-center")}>
      <input
        className={clsx(
          "w-[80%]",
          "h-[40px]",
          "mb-[20px]",
          "bg-gray-700",
          "px-2",
          "rounded-lg",
        )}
        type="text"
        name="name"
        placeholder="Resurrection Prompt"
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
