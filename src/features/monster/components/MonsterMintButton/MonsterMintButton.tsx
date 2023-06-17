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
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
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
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const ownedMonstersController = useOwnedMonstersController();
  const setSelectedMonsterIdName = useSetSelectedMonsterIdNameState();
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);

  const { chain } = useNetwork();
  const { open } = useWeb3Modal();
  const { t: tCommon } = useTranslation("common");

  /**
   * Click event
   */
  const handleClick = async () => {
    if (user.id === "") {
      alert(tCommon("mintIfNotLogin"));
      await open();
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

  if (monster === undefined) return <></>;
  if (monster.name === "") return <></>;
  return (
    <Button
      disabled={disable}
      className={clsx(
        className,
        "px-[10px]",
        "w-[100%]",
        className === undefined ? "h-[50px]" : "",
        "max-w-[150px]",
      )}
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      $ <span className={clsx("text-[20px]", "font-bold")}>{mintPrice}</span>{" "}
      MCHC
    </Button>
  );
};
