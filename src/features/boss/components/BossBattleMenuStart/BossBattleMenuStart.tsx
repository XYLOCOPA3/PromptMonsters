import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { BOSS_BATTLE_START, MAX_LIFE_POINT } from "@/const/bossBattle";
import {
  getBossAppearedMsg,
  getBossNextActionSignMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

export type BossBattleMenuStartProps = BaseProps;

/**
 * BossBattleMenuStart
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuStart = ({
  className,
}: BossBattleMenuStartProps) => {
  const language = useLanguageValue();
  const monster = useMonsterValue();
  const boss = useBossValue();
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");
  const { t: tCommon } = useTranslation("common");

  const handleFightClick = async () => {
    await bossBattleController.moveFightSelector();
  };
  const handleDefenseClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.defense(
        monster.resurrectionPrompt,
        boss.skills,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
    }
    setDisable(false);
    setLoading(false);
  };
  const handleItemClick = async () => {
    await bossBattleController.moveItemSelector();
  };

  if (boss.name === "" || language === "") return <></>;
  return (
    <div className={clsx(className, "flex", "h-[190px]", "md:h-[250px]")}>
      <div
        className={clsx(
          "w-1/3",
          "font-bold",
          "bg-[#272727]/80",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "text-center",
          "mr-[10px]",
          bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
        )}
      >
        <div className={clsx("flex", "flex-col")}>
          <Button
            variant="bossBattle"
            className={clsx("my-[5px]", "py-[10px]")}
            onClick={handleFightClick}
            disabled={disable}
          >
            {tBossBattle("fight")}
          </Button>
          <Button
            variant="bossBattle"
            className={clsx("my-[5px]", "py-[10px]")}
            onClick={handleDefenseClick}
            loading={loading}
            disabled={disable}
          >
            {tBossBattle("defense")}
          </Button>
          <Button
            variant="bossBattle"
            className={clsx("my-[5px]", "py-[10px]")}
            onClick={handleItemClick}
            disabled={bossBattle.itemIds.length === 0 || disable}
          >
            {tBossBattle("item")}
          </Button>
        </div>
      </div>
      <div
        className={clsx(
          "w-2/3",
          "font-bold",
          "bg-[#272727]/80",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          "overflow-y-scroll",
        )}
      >
        {bossBattle.turn === BOSS_BATTLE_START ? (
          <>
            {getBossAppearedMsg(boss.name, tBossBattle("bossAppeared"))}
            <br />
            <br />
          </>
        ) : (
          <></>
        )}
        {getBossNextActionSignMsg(
          bossBattle.bossSign,
          language as "日本語" | "English",
          boss.name,
        )}
      </div>
    </div>
  );
};
