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
} from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleValue } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattlePhase } from "@/types/EnumBossBattlePhase";
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
    if (bossBattle.phase === EnumBossBattlePhase.end) setIsOpen(true);
  }, [bossBattle.phase]);

  if (boss.name === "" || boss.flavor === "") return <></>;
  return (
    <>
      <div className={clsx(className)}>
        <TurnAndScore turn={bossBattle.turn} score={bossBattle.score} />
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
                <Dialog.Panel className="m-6 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#272727] p-6 text-left align-middle shadow-xl transition-all border-[1px]">
                  <div className={clsx("w-[100%]", "h-[100%]", "relative")}>
                    <div className={clsx("font-bold", "text-[32px]")}>
                      {bossBattle.defeated ? <></> : tBossBattle("score")}
                    </div>
                    <div
                      className={clsx(
                        "font-bold",
                        bossBattle.defeated ? "text-[48px]" : "text-[96px]",
                        bossBattle.defeated ? "" : "text-[#79FF63]",
                        "text-center",
                      )}
                    >
                      {bossBattle.defeated
                        ? tBossBattle("lose")
                        : bossBattle.score}
                    </div>
                    <div
                      className={clsx(
                        "flex",
                        "justify-between",
                        "items-center",
                      )}
                    >
                      {bossBattle.defeated ? (
                        <div className={clsx()}></div>
                      ) : (
                        <div
                          className={clsx(
                            "font-bold",
                            "text-[32px]",
                            "text-end",
                          )}
                        >
                          {tBossBattle("updatedHighScore")}
                        </div>
                      )}
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
        {tBossBattle("turn")}: {turn}
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
