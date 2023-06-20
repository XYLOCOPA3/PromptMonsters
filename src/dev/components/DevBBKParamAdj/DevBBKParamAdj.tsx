import { DevBBParamInput } from "@/dev/components/DevBBParamInput";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { bbKParamState } from "@/stores/bbKParamState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState } from "recoil";

export type DevBBKParamAdjProps = BaseProps;

/**
 * DevBBKParamAdj
 * @keit0728
 * @param className Style from parent element
 */
export const DevBBKParamAdj = ({ className }: DevBBKParamAdjProps) => {
  const [bbKParam, setBBKParam] = useRecoilState(bbKParamState);

  // 共通 ここから ------------------------
  const handleKCommonTurnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kTurn: e.target.value });
    });
  };
  // 共通 ここから ------------------------

  // モンスター ここから ------------------------
  const handleKMonsterAtkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterAtk: e.target.value });
    });
  };

  const handleKMonsterDefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterDef: e.target.value });
    });
  };

  const handleKMonsterIntChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterInt: e.target.value });
    });
  };

  const handleKMonsterMgrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterMgr: e.target.value });
    });
  };

  const handleKMonsterBuffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterBuff: e.target.value });
    });
  };

  const handleKMonsterDebuffChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterDebuff: e.target.value });
    });
  };

  const handleKMonsterPowerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterPower: e.target.value });
    });
  };

  const handleKMonsterHealingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterHealing: e.target.value });
    });
  };

  const handleKMonsterWeaknessChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kMonsterWeakness: e.target.value });
    });
  };
  // モンスター ここまで ------------------------

  // ボス ここから ------------------------
  const handleKBossAtkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossAtk: e.target.value });
    });
  };

  const handleKBossDefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossDef: e.target.value });
    });
  };

  const handleKBossIntChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossInt: e.target.value });
    });
  };

  const handleKBossMgrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossMgr: e.target.value });
    });
  };

  const handleKBossPowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossPower: e.target.value });
    });
  };

  const handleKBossBuffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossBuff: e.target.value });
    });
  };

  const handleKBossDebuffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBBKParam((prevState) => {
      return prevState.copyWith({ kBossDebuff: e.target.value });
    });
  };
  // ボス ここまで ------------------------

  useLayoutEffectOfSSR(() => {});

  return (
    <div
      className={clsx(className, "flex", "flex-col", "items-center", "m-[5px]")}
    >
      <div className={clsx("bg-gray-500", "font-bold", "w-[100%]", "p-[5px]")}>
        パラメータ(共通)
      </div>
      <div className={clsx("flex", "flex-col", "w-[100%]")}>
        <div className={clsx("flex")}>
          <DevBBParamInput
            title="ターン数被ダメ:"
            kParam={bbKParam.kTurn}
            onChange={handleKCommonTurnChange}
          />
        </div>
      </div>
      <div className={clsx("bg-gray-500", "font-bold", "w-[100%]", "p-[5px]")}>
        パラメータ(モンスター)
      </div>
      <div className={clsx("flex", "flex-col", "w-[100%]")}>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="ATK:"
            kParam={bbKParam.kMonsterAtk}
            onChange={handleKMonsterAtkChange}
          />
          <DevBBParamInput
            title="DEF:"
            kParam={bbKParam.kMonsterDef}
            onChange={handleKMonsterDefChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="INT:"
            kParam={bbKParam.kMonsterInt}
            onChange={handleKMonsterIntChange}
          />
          <DevBBParamInput
            title="MGR:"
            kParam={bbKParam.kMonsterMgr}
            onChange={handleKMonsterMgrChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="バフ:"
            kParam={bbKParam.kMonsterBuff}
            onChange={handleKMonsterBuffChange}
          />
          <DevBBParamInput
            title="デバフ:"
            kParam={bbKParam.kMonsterDebuff}
            onChange={handleKMonsterDebuffChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="強攻撃:"
            kParam={bbKParam.kMonsterPower}
            onChange={handleKMonsterPowerChange}
          />
          <DevBBParamInput
            title="回復:"
            kParam={bbKParam.kMonsterHealing}
            onChange={handleKMonsterHealingChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="弱点特徴補正:"
            kParam={bbKParam.kMonsterWeakness}
            onChange={handleKMonsterWeaknessChange}
          />
        </div>
      </div>
      <div className={clsx("bg-gray-500", "font-bold", "w-[100%]", "p-[5px]")}>
        パラメータ(ボス)
      </div>
      <div className={clsx("flex", "flex-col", "w-[100%]")}>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="ATK:"
            kParam={bbKParam.kBossAtk}
            onChange={handleKBossAtkChange}
          />
          <DevBBParamInput
            title="DEF:"
            kParam={bbKParam.kBossDef}
            onChange={handleKBossDefChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="INT:"
            kParam={bbKParam.kBossInt}
            onChange={handleKBossIntChange}
          />
          <DevBBParamInput
            title="MGR:"
            kParam={bbKParam.kBossMgr}
            onChange={handleKBossMgrChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="バフ:"
            kParam={bbKParam.kBossBuff}
            onChange={handleKBossBuffChange}
          />
          <DevBBParamInput
            title="デバフ:"
            kParam={bbKParam.kBossDebuff}
            onChange={handleKBossDebuffChange}
          />
        </div>
        <div className={clsx("flex", "justify-between")}>
          <DevBBParamInput
            title="強攻撃:"
            kParam={bbKParam.kBossPower}
            onChange={handleKBossPowerChange}
          />
        </div>
      </div>
    </div>
  );
};
