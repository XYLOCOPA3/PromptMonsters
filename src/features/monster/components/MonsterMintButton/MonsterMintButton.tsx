import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { useMintPriceValue } from "@/hooks/useMintPrice";
import { useMonsterState } from "@/hooks/useMonster";
import { useUserValue } from "@/hooks/useUser";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { userInitState } from "@/stores/userInitState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue, useSetRecoilState } from "recoil";

export type MonsterMintButtonProps = BaseProps;

/**
 * Monster mint button
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterMintButton = ({ className }: MonsterMintButtonProps) => {
  const user = useUserValue();
  const mintPrice = useMintPriceValue();
  const userInit = useRecoilValue(userInitState);
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const setMonsterMinted = useSetRecoilState(monsterMintedState);

  /**
   * Click event
   */
  const handleClick = async () => {
    setLoading(true);
    try {
      if (user.id === "") {
        alert("Please login");
        setLoading(false);
        return;
      }
      await monsterController.mint(user.id, monster);
      setMonsterMinted(true);
    } catch (e) {
      console.error(e);
      alert("Failed to mint.\n\n" + e);
    }
    setLoading(false);
  };

  if (monster.name === "") return <></>;
  return (
    <Button
      disabled={loading}
      className={clsx(
        className,
        "w-[160px]",
        "h-[40px]",
        "text-[12px]",
        "md:text-[16px]",
      )}
      variant="secondary"
      loading={loading || !userInit}
      onClick={handleClick}
    >
      MINT: {mintPrice} MCHC
    </Button>
  );
};
