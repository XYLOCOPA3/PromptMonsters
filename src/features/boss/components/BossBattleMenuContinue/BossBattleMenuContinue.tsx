import { MAX_LIFE_POINT } from "@/const/bossBattle";
import { BossBattleNoButton, BossBattleYesButton } from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

export type BossBattleMenuContinueProps = BaseProps;

/**
 * BossBattleMenuContinue
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuContinue = ({
  className,
}: BossBattleMenuContinueProps) => {
  const monster = useMonsterValue();
  const boss = useBossValue();
  const [bossBattle, bossBattleController] = useBossBattleState();
  const setDisable = useSetRecoilState(disableState);
  const { t: tBossBattle } = useTranslation("boss-battle");

  const end = async () => {
    setDisable(true);
    try {
      await bossBattleController.end(monster.resurrectionPrompt);
    } catch (error) {
      console.error(error);
      // TODO: エラー文考える
      if (error instanceof Error) alert("Error\n\nReason: " + error.message);
      else alert("Error");
    }
    setDisable(false);
  };

  useLayoutEffectOfSSR(() => {
    if (bossBattle.lp <= 0) end();
  }, [bossBattle.lp]);

  if (monster.name === "" || boss.name === "") return <></>;
  return (
    <>
      <div
        className={clsx(
          className,
          "flex",
          "mb-[10px]",
          "h-[190px]",
          "md:h-[250px]",
        )}
      >
        <div
          className={clsx(
            "w-[100%]",
            "font-bold",
            "bg-[#272727]/80",
            "p-[10px]",
            "rounded-lg",
            "border-[1px]",
            bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
            "overflow-y-scroll",
          )}
        >
          {tBossBattle("continue")}
          <br />
          <br />
          <br />
          <div className={clsx("whitespace-pre-wrap", "font-normal")}>
            {tBossBattle("continueNote")}
          </div>
        </div>
      </div>
      <div className={clsx("flex", "justify-between", "my-[5px]")}>
        <BossBattleNoButton className={clsx("w-1/4")} />
        <BossBattleYesButton className={clsx("w-1/4")} />
      </div>
    </>
  );
};
