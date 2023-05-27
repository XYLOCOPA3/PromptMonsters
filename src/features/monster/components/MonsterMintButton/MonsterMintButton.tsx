import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { mchVerse } from "@/const/chainParams";
import { useMintPriceValue } from "@/hooks/useMintPrice";
import { useMonsterState } from "@/hooks/useMonster";
import { useOwnedMonstersController } from "@/hooks/useOwnedMonsters";
import { useSetSelectedMonsterIdNameState } from "@/hooks/useSelectedMonsterIdName";
import { useUserValue } from "@/hooks/useUser";
import { disableState } from "@/stores/disableState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNetwork } from "wagmi";

export type MonsterMintButtonProps = BaseProps;

/**
 * Monster mint button
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterMintButton = ({ className }: MonsterMintButtonProps) => {
  const user = useUserValue();
  const mintPrice = useMintPriceValue();
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const ownedMonstersController = useOwnedMonstersController();
  const setSelectedMonsterIdName = useSetSelectedMonsterIdNameState();
  const [disable, setDisable] = useRecoilState(disableState);
  const { chain } = useNetwork();

  /**
   * Click event
   */
  const handleClick = async () => {
    if (user.id === "") {
      alert("Please log in if you would like to mint a monster.");
      return;
    }
    if (chain!.id !== mchVerse.id) {
      alert("Please change network to MCHVerse Mainnet.");
      return;
    }
    setDisable(true);
    setLoading(true);
    try {
      const newMonster = await monsterController.mint(
        user.id,
        monster.resurrectionPrompt,
      );
      setSelectedMonsterIdName(`${newMonster.name} | id: ${newMonster.id}`);
      ownedMonstersController.updateAfterMinted(newMonster);
      setMonsterMinted(true);
    } catch (e) {
      console.error(e);
      alert("Failed to mint.\n\n" + e);
    }
    setDisable(false);
    setLoading(false);
  };

  if (monster.name === "") return <></>;
  return (
    <Button
      disabled={disable}
      className={clsx(
        className,
        "px-[10px]",
        "w-[100%]",
        "h-[40px]",
        "max-w-[150px]",
      )}
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      MINT: {mintPrice} MCHC
    </Button>
  );
};
