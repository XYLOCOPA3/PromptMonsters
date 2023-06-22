import { useState } from "react";
import { Button } from "@/components/elements/Button";
import {
  BOSS_NEXT_ACTION_SIGNS,
  FIRST_TURN,
  MAX_LIFE_POINT,
} from "@/const/bossBattle";
import { ERROR_MAINTENANCE } from "@/const/error";
import {
  getBossAppearedMsg,
  getBossSignMsg,
  getHavingWeakFeatureMsg,
  getTurnMsg,
} from "@/features/boss/utils/utils";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useBossEventValue } from "@/hooks/useBossEvent";
import { useLanguageValue } from "@/hooks/useLanguage";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattleMsg } from "@/types/EnumBossBattleMsg";
import { EventKey } from "@/types/EventKey";
import { hasBossWeaknessFeatures } from "@/utils/bossBattleUtils";
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
  const bossEvent = useBossEventValue();
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");
  const { t: tCommon } = useTranslation("common");

  const weakFeatures = hasBossWeaknessFeatures(
    bossEvent.eventKey as EventKey,
    monster.feature,
    monster.name,
    monster.flavor,
  );

  const pushHistory = () => {
    if (bossBattle.turn === FIRST_TURN) {
      bossBattleController.pushLog({
        value: getBossAppearedMsg(boss.name, tBossBattle("bossAppeared")),
        type: EnumBossBattleMsg.none,
      });
      if (weakFeatures !== null)
        bossBattleController.pushLog({
          value: getHavingWeakFeatureMsg(
            monster.name,
            boss.name,
            weakFeatures[0],
            tBossBattle("havingWeakFeature"),
          ),
          type: EnumBossBattleMsg.none,
        });
      bossBattleController.pushLog({ value: "", type: EnumBossBattleMsg.none });
      bossBattleController.pushLog({
        value: getTurnMsg(bossBattle.turn, tBossBattle("turn")),
        type: EnumBossBattleMsg.none,
      });
    }
    bossBattleController.pushLog({
      value: getBossSignMsg(
        boss.name,
        BOSS_NEXT_ACTION_SIGNS[bossEvent.eventKey as EventKey][
          language as "日本語" | "English"
        ][bossBattle.bossSign],
        tBossBattle("bossSign"),
      ),
      type: EnumBossBattleMsg.none,
    });
  };

  const handleFightClick = () => {
    bossBattleController.moveFightSelector();
    pushHistory();
  };

  const handleDefenseClick = async () => {
    setDisable(true);
    setLoading(true);
    try {
      await bossBattleController.defense(
        monster.resurrectionPrompt,
        boss.skills,
      );
      pushHistory();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message !== ERROR_MAINTENANCE)
          alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      } else alert(tCommon("failedTx"));
    }
    setDisable(false);
    setLoading(false);
  };

  const handleItemClick = () => {
    bossBattleController.moveItemSelector();
    pushHistory();
  };

  if (boss.name === "" || language === "" || bossEvent.eventKey === "")
    return <></>;
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
          "mr-[5px]",
          bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          "md:mr-[10px]",
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
        {bossBattle.turn === FIRST_TURN ? (
          <>
            {getBossAppearedMsg(boss.name, tBossBattle("bossAppeared"))}
            <br />
            <br />
          </>
        ) : (
          <></>
        )}
        {bossBattle.turn === FIRST_TURN ? (
          weakFeatures !== null ? (
            <div className={clsx("whitespace-pre-wrap")}>
              {getHavingWeakFeatureMsg(
                monster.name,
                boss.name,
                weakFeatures[0],
                tBossBattle("havingWeakFeature"),
              )}
              <br />
              <br />
            </div>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
        {getBossSignMsg(
          boss.name,
          BOSS_NEXT_ACTION_SIGNS[bossEvent.eventKey as EventKey][
            language as "日本語" | "English"
          ][bossBattle.bossSign],
          tBossBattle("bossSign"),
        )}
      </div>
    </div>
  );
};
