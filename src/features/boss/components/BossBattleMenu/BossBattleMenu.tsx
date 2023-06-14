import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { MAX_LIFE_POINT } from "@/const/bossBattle";
import {
  BossBattleMenuContinue,
  BossBattleMenuFight,
  BossBattleMenuItem,
  BossBattleMenuResult,
  BossBattleMenuStart,
  BossBattleOKButton,
  BossBattleTweetButton,
} from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattlePhase } from "@/types/EnumBossBattlePhase";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

export type BossBattleMenuProps = BaseProps;

/**
 * BossBattleMenu
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenu = ({ className }: BossBattleMenuProps) => {
  const boss = useBossValue();
  const monster = useMonsterValue();
  const setDisable = useSetRecoilState(disableState);
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
  const { t: tBossBattle } = useTranslation("boss-battle");
  const { t: tCommon } = useTranslation("common");

  const closeModal = () => {
    setIsOpen(false);
    bossBattleController.reset();
    push("/boss");
  };

  const end = async () => {
    setDisable(true);
    try {
      await bossBattleController.end(monster.resurrectionPrompt);
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      else alert(tCommon("failedTx"));
    }
    setDisable(false);
  };

  useLayoutEffectOfSSR(() => {
    if (bossBattle.phase === EnumBossBattlePhase.end) setIsOpen(true);
  }, [bossBattle.phase]);

  useLayoutEffectOfSSR(() => {
    if (!bossBattle.bossBattleStarted) {
      alert(tBossBattle("invalidStarted"));
      push("/boss");
    }
  }, []);

  useLayoutEffectOfSSR(() => {
    if (bossBattle.lp <= 0) end();
  }, [bossBattle.lp]);

  if (boss.name === "" || boss.flavor === "") return <></>;
  return (
    <>
      <div
        className={clsx(
          className,
          bossBattle.lp < MAX_LIFE_POINT / 4 ? "text-[#FCA7A4]" : "",
          "text-[14px]",
          "md:text-[16px]",
        )}
      >
        <HighScore highScore={bossBattle.highScore} />
        <TurnAndScore
          turn={bossBattle.turn}
          score={bossBattle.score}
          lp={bossBattle.lp}
          highScore={bossBattle.highScore}
        />
        <MonsterNameAndUserLifePoint
          name={monster.name}
          lifePoint={bossBattle.lp}
        />
        <Menu phase={bossBattle.phase} />
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="m-6 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#272727]/100 p-6 text-left align-middle shadow-xl transition-all border-[1px]">
                  <div className={clsx("w-[100%]", "h-[100%]", "relative")}>
                    <div className={clsx("flex", "justify-between")}>
                      <div
                        className={clsx(
                          "font-bold",
                          "text-[20px]",
                          "md:text-[32px]",
                        )}
                      >
                        {tBossBattle("score")}
                      </div>
                      <BossBattleTweetButton className={clsx("mr-[10px]")} />
                    </div>
                    <div
                      className={clsx(
                        "font-bold",
                        "text-[72px]",
                        bossBattle.defeated
                          ? "text-[#f86868]"
                          : bossBattle.lp > bossBattle.highScore
                          ? "text-[#79FF63]"
                          : "",
                        "text-center",
                        "md:text-[96px]",
                      )}
                    >
                      {bossBattle.defeated ? 0 : bossBattle.score}
                    </div>
                    <div
                      className={clsx("flex", "justify-end", "items-center")}
                    >
                      <BossBattleOKButton
                        className={clsx(
                          "px-[20px]",
                          "text-[14px]",
                          "md:px-[30px]",
                          "md:text-[20px]",
                        )}
                        onClick={closeModal}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

/**
 * HighScore
 */
const HighScore = ({ highScore }: any) => {
  // TODO: ハイスコアコントラクトから取ってくる
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <div className={clsx("flex", "mb-[2px]")}>
      <div className={clsx("px-[10px]", "text-end", "w-[100%]")}>
        {tBossBattle("highScore")}: {highScore}
      </div>
    </div>
  );
};
/**
 * Boss battle score
 * @param score score
 */
const TurnAndScore = ({ turn, score, lp, highScore }: any) => {
  // TODO: ハイスコア超えたら黄金色にする
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <div className={clsx("flex", "mb-[10px]")}>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]/80",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "text-start",
          "w-1/2",
          "mr-[5px]",
          lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
        )}
      >
        {tBossBattle("turn")}: {turn}
      </div>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]/80",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "text-end",
          "w-1/2",
          "ml-[5px]",
          lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          score > highScore ? "text-[#79FF63]" : "",
        )}
      >
        {tBossBattle("score")}: {score}
      </div>
    </div>
  );
};

/**
 * Display monster name and user life point
 * @param name monster name
 * @param lifePoint user life point
 */
const MonsterNameAndUserLifePoint = ({ name, lifePoint }: any) => {
  return (
    <div className={clsx("flex", "justify-between", "mb-[10px]", "w-[100%]")}>
      <div
        className={clsx(
          "w-2/3",
          "font-bold",
          "bg-[#272727]/80",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "truncate",
          "mr-[10px]",
          lifePoint < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
        )}
      >
        {name}
      </div>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]/80",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "w-1/3",
          "text-end",
          lifePoint < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
        )}
      >
        LP: {lifePoint}
      </div>
    </div>
  );
};

/**
 * Boss battle score
 * @param score score
 */
const Menu = ({ phase }: any) => {
  switch (phase) {
    case EnumBossBattlePhase.start:
      return <BossBattleMenuStart />;
    case EnumBossBattlePhase.fightSelect:
      return <BossBattleMenuFight />;
    case EnumBossBattlePhase.itemSelect:
      return <BossBattleMenuItem />;
    case EnumBossBattlePhase.result:
      return <BossBattleMenuResult />;
    case EnumBossBattlePhase.continue:
      return <BossBattleMenuContinue />;
    default:
      return <></>;
  }
};
