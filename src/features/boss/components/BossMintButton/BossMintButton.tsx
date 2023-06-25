import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { Warning } from "@/components/elements/Warning";
import { mchVerse } from "@/const/chainParams";
import {
  getMintBossMsg,
  getMintConfirmMsg,
  getRemintBossMsg,
} from "@/features/boss/utils/utils";
import { useBossState } from "@/hooks/useBoss";
import { useBossMintPriceValue } from "@/hooks/useBossMintPrice";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMintedBossState } from "@/hooks/useMintedBoss";
import {
  useOwnedMonstersController,
  useOwnedMonstersValue,
} from "@/hooks/useOwnedMonsters";
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

export type BossMintButtonProps = BaseProps;

/**
 * BossMintButton
 * @keit0728
 * @param className Style from parent element
 */
export const BossMintButton = ({ className }: BossMintButtonProps) => {
  const user = useUserValue();
  const bossMintPrice = useBossMintPriceValue();
  const language = useLanguageValue();
  const ownedMonsters = useOwnedMonstersValue();
  const setMonsterMinted = useSetRecoilState(monsterMintedState);
  const ownedMonstersController = useOwnedMonstersController();
  const setSelectedMonsterIdName = useSetSelectedMonsterIdNameState();
  const [mintedBoss, mintedBossController] = useMintedBossState();
  const [boss, bossController] = useBossState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);

  const { chain } = useNetwork();
  const { open } = useWeb3Modal();
  const { t: tCommon } = useTranslation("common");
  const { t: tBoss } = useTranslation("boss");

  /**
   * Click event
   */
  const handleClick = async () => {
    if (user.id === "") {
      alert(tCommon("notLogin"));
      await open();
      return;
    }
    if (chain!.id !== mchVerse.id) {
      alert(tCommon("changeNetwork"));
      return;
    }
    if (language === "") return;
    const checkFlg = confirm(
      getMintConfirmMsg(language, boss.name, tBoss("mintConfirm")),
    );
    if (!checkFlg) return;
    setDisable(true);
    setLoading(true);
    try {
      const resurrectionPrompts = [];
      for (let i = 0; i < ownedMonsters.length; i++) {
        if (
          ownedMonsters[i].id === "" ||
          ownedMonsters[i].resurrectionPrompt === ""
        )
          continue;
        resurrectionPrompts.push(ownedMonsters[i].resurrectionPrompt);
      }
      const newMonster = await bossController.mint(
        language,
        resurrectionPrompts,
        user.id,
      );
      console.log(newMonster);
      mintedBossController.set(newMonster);
      setSelectedMonsterIdName(`${newMonster.name} | id: ${newMonster.id}`);
      ownedMonstersController.add(newMonster);
      setMonsterMinted(true);
    } catch (e) {
      console.error(e);
      alert("Failed to mint.\n\n" + e);
    }
    setDisable(false);
    setLoading(false);
  };

  if (language === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "flex",
        "justify-center",
        "item-center",
        "max-w-[512px]",
      )}
    >
      <Warning className={clsx("mr-[5px]")} hintText={tBoss("warning")} />
      <Button
        disabled={disable}
        className={clsx("px-[10px]", "h-[50px]", "w-[100%]")}
        variant="secondary"
        loading={loading}
        onClick={handleClick}
      >
        {mintedBoss.id === ""
          ? getMintBossMsg(boss.name, bossMintPrice, tBoss("mint"))
          : getRemintBossMsg(bossMintPrice, tBoss("remint"))}
      </Button>
    </div>
  );
};
