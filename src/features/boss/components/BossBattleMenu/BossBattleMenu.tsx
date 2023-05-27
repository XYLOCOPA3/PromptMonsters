import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { MAX_LIFE_POINT } from "@/const/bossBattle";
import {
  BossBattleMenuBossActionResult,
  BossBattleMenuContinue,
  BossBattleMenuDefenseResult,
  BossBattleMenuFight,
  BossBattleMenuFightResult,
  BossBattleMenuItem,
  BossBattleMenuItemResult,
  BossBattleMenuStart,
  BossBattleOKButton,
} from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import { BossBattlePhase } from "@/types/BossBattlePhase";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type BossBattleMenuProps = BaseProps;

/**
 * BossBattleMenu
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenu = ({ className }: BossBattleMenuProps) => {
  const boss = useBossValue();
  const bossBattle = useBossBattleValue();
  const monster = useMonsterValue();
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
  const { t: tBossBattle } = useTranslation("boss-battle");

  const closeModal = () => {
    setIsOpen(false);
    push("/boss");
  };

  useLayoutEffectOfSSR(() => {
    if (bossBattle.phase === BossBattlePhase.end) setIsOpen(true);
  }, [bossBattle.phase]);

  if (boss.name === "" || boss.flavor === "") return <></>;
  return (
    <>
      <div className={clsx(className)}>
        <TurnAndScore turn={bossBattle.turn} score={bossBattle.score} />
        <MonsterNameAndUserLifePoint
          name={monster.name}
          lifePoint={bossBattle.lifePoint}
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
                <Dialog.Panel className="m-6 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all border-[1px]">
                  <div className={clsx("w-[100%]", "h-[100%]", "relative")}>
                    <div className={clsx("font-bold", "text-[32px]")}>
                      {tBossBattle("score")}
                    </div>
                    <div
                      className={clsx(
                        "font-bold",
                        "text-[96px]",
                        "text-[#79FF63]",
                        "text-center",
                      )}
                    >
                      {bossBattle.score}
                    </div>
                    <div
                      className={clsx(
                        "font-bold",
                        "text-[32px]",
                        "text-end",
                        "mb-[10px]",
                      )}
                    >
                      {tBossBattle("updatedHighScore")}
                    </div>
                    <div className={clsx("flex", "justify-end")}>
                      <BossBattleOKButton
                        className={clsx("px-[30px]", "text-[20px]")}
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
 * Boss battle score
 * @param score score
 */
const TurnAndScore = ({ turn, score }: any) => {
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <div className={clsx("flex", "mb-[10px]")}>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "text-center",
          "w-1/3",
        )}
      >
        {tBossBattle("turn")}: {turn + 1}
      </div>
      <div className={clsx("w-1/3", "mr-[10px]")}></div>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "text-center",
          "w-1/3",
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
          "bg-[#272727]",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "truncate",
          "mr-[10px]",
        )}
      >
        {name}
      </div>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]",
          "p-[10px]",
          "rounded-lg",
          "border-[1px]",
          "w-1/3",
          "text-center",
        )}
      >
        LP: {lifePoint} / {MAX_LIFE_POINT}
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
    case BossBattlePhase.start:
      return <BossBattleMenuStart />;
    case BossBattlePhase.fightSelect:
      return <BossBattleMenuFight />;
    case BossBattlePhase.fightResult:
      return <BossBattleMenuFightResult />;
    case BossBattlePhase.defenseResult:
      return <BossBattleMenuDefenseResult />;
    case BossBattlePhase.itemSelect:
      return <BossBattleMenuItem />;
    case BossBattlePhase.itemResult:
      return <BossBattleMenuItemResult />;
    case BossBattlePhase.bossActionResult:
      return <BossBattleMenuBossActionResult />;
    case BossBattlePhase.continue:
      return <BossBattleMenuContinue />;
    default:
      return <></>;
  }
};
