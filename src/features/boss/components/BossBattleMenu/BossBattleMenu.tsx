import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FIRST_TURN,
  MAX_LIFE_POINT,
  MAX_TURN_ADJ,
  MIN_LIFE_POINT,
} from "@/const/bossBattle";
import { ERROR_MAINTENANCE } from "@/const/error";
import {
  BossBattleMenuContinue,
  BossBattleMenuFight,
  BossBattleMenuItem,
  BossBattleMenuResult,
  BossBattleMenuStart,
  BossBattleOKButton,
  BossBattleTweetButton,
} from "@/features/boss";
import { MonsterMintButton } from "@/features/monster";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { useUserValue } from "@/hooks/useUser";
import { bbKParamState } from "@/stores/bbKParamState";
import { disableState } from "@/stores/disableState";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { scoreOpenedState } from "@/stores/scoreOpenedState";
import { BaseProps } from "@/types/BaseProps";
import { EnumBossBattlePhase } from "@/types/EnumBossBattlePhase";
import { EnumBossBattleQuote } from "@/types/EnumBossBattleQuote";
import { getQuoteType } from "@/utils/bossBattleUtils";
import { Dialog, Transition } from "@headlessui/react";
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import uuid from "react-uuid";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export type BossBattleMenuProps = BaseProps;

/**
 * BossBattleMenu
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenu = ({ className }: BossBattleMenuProps) => {
  const user = useUserValue();
  const boss = useBossValue();
  const monster = useMonsterValue();
  const monsterMinted = useRecoilValue(monsterMintedState);
  const setDisable = useSetRecoilState(disableState);
  const [bossBattle, bossBattleController] = useBossBattleState();
  const [scoreOpened, setScoreOpened] = useRecoilState(scoreOpenedState);
  const [loginNotification, setLoginNotification] = useState(false);
  const { push, locale } = useRouter();
  const { t: tBossBattle } = useTranslation("boss-battle");
  const { t: tCommon } = useTranslation("common");
  const { isOpen } = useWeb3Modal();

  const closeModal = () => {
    setScoreOpened(false);
    bossBattleController.reset();
    push("/boss");
  };

  const end = async () => {
    setDisable(true);
    try {
      await bossBattleController.end(monster.resurrectionPrompt);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message !== ERROR_MAINTENANCE)
          alert(`${tCommon("failedTx")}` + "\n\nReason: " + error.message);
      } else alert(tCommon("failedTx"));
    }
    setDisable(false);
  };

  useLayoutEffectOfSSR(() => {
    if (bossBattle.lp <= MIN_LIFE_POINT) end();
  }, [bossBattle.lp]);

  useLayoutEffectOfSSR(() => {
    if (bossBattle.phase !== EnumBossBattlePhase.end) return;
    if (isOpen) setLoginNotification(true);
    setScoreOpened(!isOpen);
  }, [isOpen]);

  useLayoutEffectOfSSR(() => {
    if (!loginNotification) return;
    if (user.id === "") return;
    alert(tCommon("loginNotification"));
    setLoginNotification(false);
  }, [loginNotification, user.id]);

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
        <MonsterStatus
          status={monster.status}
          lifePoint={bossBattle.lp}
          monsterAdj={bossBattle.monsterAdj}
          turn={bossBattle.turn}
        />
        <Menu phase={bossBattle.phase} defeated={bossBattle.defeated} />
      </div>
      <Transition appear show={scoreOpened} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                        {bossBattle.score > bossBattle.highScore &&
                        !bossBattle.defeated
                          ? `${tBossBattle("highScore")}!!!`
                          : tBossBattle("score")}
                      </div>
                      <BossBattleTweetButton className={clsx("mr-[10px]")} />
                    </div>
                    <div
                      className={clsx(
                        "font-bold",
                        "text-[72px]",
                        bossBattle.defeated
                          ? ["text-[#f86868]", "line-through"]
                          : bossBattle.score > bossBattle.highScore
                          ? "text-[#79FF63]"
                          : "",
                        "text-center",
                        "md:text-[96px]",
                      )}
                    >
                      {bossBattle.score}
                    </div>
                    <div
                      className={clsx(
                        "my-[10px]",
                        "border-[1px]",
                        "rounded-lg",
                        "p-[10px]",
                        "h-[200px]",
                        "overflow-y-scroll",
                        "text-[14px]",
                        "md:h-[250px]",
                        "md:text-[16px]",
                      )}
                    >
                      {bossBattle.logs.map((log, i) => {
                        if (log.value === "") return <br key={uuid()} />;
                        const quoteType = getQuoteType(log.type);
                        let prefix = "";
                        if (i > 0) {
                          if (
                            bossBattle.logs[i - 1].type === log.type &&
                            quoteType !== EnumBossBattleQuote.system
                          ) {
                            prefix = "▶︎ ";
                          }
                        }
                        return (
                          <div
                            key={uuid()}
                            className={clsx(
                              "whitespace-pre-wrap",
                              quoteType === EnumBossBattleQuote.monster
                                ? "text-[#79FF63]"
                                : quoteType === EnumBossBattleQuote.boss
                                ? "text-[#f86868]"
                                : "",
                            )}
                          >
                            {`${prefix}${log.value}`}
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className={clsx(
                        "flex",
                        monsterMinted ? "justify-end" : "justify-between",
                        "items-center",
                      )}
                    >
                      {monsterMinted ? (
                        <></>
                      ) : (
                        <MonsterMintButton
                          className={clsx("h-[41px]", "md:h-[50px]")}
                        />
                      )}
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
                    {monsterMinted ? (
                      <></>
                    ) : (
                      <div
                        className={clsx(
                          "mt-[10px]",
                          "font-bold",
                          "text-[13px]",
                          "md:text-[16px]",
                        )}
                      >
                        {tBossBattle("mint")}
                        <Link
                          className={clsx(
                            "text-blue-500",
                            "hover:underline",
                            "font-bold",
                          )}
                          href={
                            locale === "ja"
                              ? "https://promptmonsters.substack.com/p/mchyoshka?r=2coxjj&utm_campaign=post&utm_medium=web"
                              : "https://promptmonsters.substack.com/p/new-mode-collaboration-campaignintroducing"
                          }
                          target="_blank"
                        >
                          {` ${tBossBattle("campaign")} `}
                        </Link>
                        {tBossBattle("join")}
                      </div>
                    )}
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
  const { t: tBossBattle } = useTranslation("boss-battle");
  return (
    <div className={clsx("flex", "mb-[5px]", "md:mb-[10px]")}>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]/80",
          "p-[5px]",
          "rounded-lg",
          "border-[1px]",
          "text-start",
          "w-1/2",
          "mr-[5px]",
          lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          "md:mr-[10px]",
          "md:p-[10px]",
        )}
      >
        {tBossBattle("turn")}: {turn}
      </div>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]/80",
          "p-[5px]",
          "rounded-lg",
          "border-[1px]",
          "text-end",
          "w-1/2",
          lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          "md:p-[10px]",
        )}
      >
        {tBossBattle("score")}:{" "}
        <span className={clsx(score > highScore ? "text-[#79FF63]" : "")}>
          {score}
        </span>
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
    <div
      className={clsx(
        "flex",
        "justify-between",
        "mb-[5px]",
        "w-[100%]",
        "md:mb-[10px]",
      )}
    >
      <div
        className={clsx(
          "w-2/3",
          "font-bold",
          "bg-[#272727]/80",
          "p-[5px]",
          "rounded-lg",
          "border-[1px]",
          "truncate",
          "mr-[5px]",
          lifePoint < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          "md:mr-[10px]",
          "md:p-[10px]",
        )}
      >
        {name}
      </div>
      <div
        className={clsx(
          "font-bold",
          "bg-[#272727]/80",
          "p-[5px]",
          "rounded-lg",
          "border-[1px]",
          "w-1/3",
          "text-end",
          lifePoint < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
          "md:p-[10px]",
        )}
      >
        LP: {lifePoint}
      </div>
    </div>
  );
};

/**
 * Display monster status
 * @param name monster name
 * @param lifePoint user life point
 * @param monsterAdj monster adjust
 * @param turn turn
 */
const MonsterStatus = ({ status, lifePoint, monsterAdj, turn }: any) => {
  const bbKParam = useRecoilValue(bbKParamState);

  let turnAdj = Number(bbKParam.kTurn) * (turn - 1);
  if (turn === FIRST_TURN) turnAdj = 1;
  if (turnAdj > MAX_TURN_ADJ) turnAdj = MAX_TURN_ADJ;
  const atk = Math.floor((status.ATK * monsterAdj * turnAdj) / 100);
  const def = Math.floor((status.DEF * monsterAdj) / 100);
  const int = Math.floor((status.INT * monsterAdj * turnAdj) / 100);
  const mgr = Math.floor((status.MGR * monsterAdj) / 100);

  return (
    <div
      className={clsx(
        "mb-[5px]",
        "w-[100%]",
        "font-bold",
        "bg-[#272727]/80",
        "p-[5px]",
        "md:p-[10px]",
        "rounded-lg",
        "border-[1px]",
        "truncate",
        lifePoint < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
        "md:mb-[10px]",
      )}
    >
      ATK:{" "}
      <span
        className={clsx(
          atk > status.ATK
            ? "text-[#79FF63]"
            : atk < status.ATK
            ? "text-[#f86868]"
            : "",
        )}
      >
        {atk}
      </span>{" "}
      / DEF:{" "}
      <span
        className={clsx(
          def > status.DEF
            ? "text-[#79FF63]"
            : def < status.DEF
            ? "text-[#f86868]"
            : "",
        )}
      >
        {def}
      </span>{" "}
      / INT:{" "}
      <span
        className={clsx(
          int > status.INT
            ? "text-[#79FF63]"
            : int < status.INT
            ? "text-[#f86868]"
            : "",
        )}
      >
        {int}
      </span>{" "}
      / MGR:{" "}
      <span
        className={clsx(
          mgr > status.MGR
            ? "text-[#79FF63]"
            : mgr < status.MGR
            ? "text-[#f86868]"
            : "",
        )}
      >
        {mgr}
      </span>
    </div>
  );
};

/**
 * Boss battle score
 * @param score score
 */
const Menu = ({ phase, defeated }: any) => {
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
    case EnumBossBattlePhase.end:
      if (defeated) return <BossBattleMenuResult />;
      return <BossBattleMenuContinue />;
    default:
      return <></>;
  }
};
