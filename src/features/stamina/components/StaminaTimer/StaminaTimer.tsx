import { RPC_URL } from "@/const/chainParams";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { monsterMintedState } from "@/stores/monsterMintedState";
import { staminaTimeStdState } from "@/stores/staminaTimeStdState";
import { Stamina__factory } from "@/typechain";
import { BaseProps } from "@/types/BaseProps";
import { StaminaTime } from "@/types/StaminaTime";
import clsx from "clsx";
import { ethers } from "ethers";
import { useRecoilState, useRecoilValue } from "recoil";

export type StaminaTimerProps = BaseProps;

/**
 * StaminaTimer
 * @keit0728
 * @param className Style from parent element
 */
export const StaminaTimer = ({ className }: StaminaTimerProps) => {
  const monster = useMonsterValue();
  const monsterMinted = useRecoilValue(monsterMintedState);
  const [staminaTimeStd, setStaminaTimeStd] =
    useRecoilState(staminaTimeStdState);

  const fetch = async () => {
    if (monster.id === "") {
      setStaminaTimeStd({ hours: 0, minutes: 0, seconds: 0 });
      return false;
    }
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
    const stamina = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      provider,
    );

    const results = await Promise.all([
      stamina.timeStd(ethers.BigNumber.from(monster.id)),
      stamina.staminaRecoveryTime(),
      stamina.staminaLimit(),
    ]);
    const timeStd = Number(results[0]);
    const staminaRecoveryTime = Number(results[1]);
    const staminaLimit = Number(results[2]);

    const fullRecoveredTime = timeStd + staminaLimit * staminaRecoveryTime;
    const remainRecoveredTime =
      fullRecoveredTime - Math.floor(Date.now() / 1000);
    if (remainRecoveredTime <= 0) {
      setStaminaTimeStd({ hours: 0, minutes: 0, seconds: 0 });
      return false;
    }
    const recoveredTime = remainRecoveredTime % staminaRecoveryTime;

    const recoveredTimeStd = _convertSecondsToTimeStd(
      Math.floor(recoveredTime),
    );
    setStaminaTimeStd(recoveredTimeStd);
    return true;
  };

  useLayoutEffectOfSSR(() => {
    if (!monsterMinted) {
      setStaminaTimeStd({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const interval = setInterval(async () => {
      const result = await fetch();
      if (!result) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [monster, monsterMinted]);

  if (
    monster.name === "" ||
    !monsterMinted ||
    _isStaminaTimeStdZero(staminaTimeStd)
  )
    return <></>;
  return (
    <div className={clsx(className)}>
      Stamina +1 after {_displayStaminaTimeStd(staminaTimeStd)}
    </div>
  );
};

/**
 * Check all staminaTimeStd parameters 0 or not
 * @param staminaTimeStd staminaTimeStd
 */
const _isStaminaTimeStdZero = (staminaTimeStd: StaminaTime) => {
  return (
    staminaTimeStd.hours === 0 &&
    staminaTimeStd.minutes === 0 &&
    staminaTimeStd.seconds === 0
  );
};

/**
 * Display staminaTimeStd as "00:00:00"
 * For example, if staminaTimeStd is { hours: 1, minutes: 2, seconds: 3 }, "01:02:03" will be displayed
 * @param staminaTimeStd staminaTimeStd
 */
export const _displayStaminaTimeStd = (staminaTimeStd: StaminaTime) => {
  return `${_displayTime(staminaTimeStd.hours)}:${_displayTime(
    staminaTimeStd.minutes,
  )}:${_displayTime(staminaTimeStd.seconds)}`;
};

/**
 * Display time as "00"
 * For example, if time is 1, "01" will be displayed
 * @param time time
 * @return time as "00"
 */
export const _displayTime = (time: number): string => {
  return time < 10 ? `0${time}` : `${time}`;
};

/**
 * 秒数を時間、分、秒に変換する
 * 例えば、秒数が 3661 だった場合、{ hours: 1, minutes: 1, seconds: 1 } が返る
 * @param seconds 秒数
 * @return 時間、分、秒
 */
export const _convertSecondsToTimeStd = (seconds: number): StaminaTime => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secondsRemain = seconds - hours * 3600 - minutes * 60;
  return { hours, minutes, seconds: secondsRemain };
};
