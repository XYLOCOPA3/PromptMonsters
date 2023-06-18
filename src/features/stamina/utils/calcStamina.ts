import { RPC_URL } from "@/const/chainParams";
import { MAX_STAMINA } from "@/const/monster";
import { ServerStamina } from "@/features/stamina/api/contracts/ServerStamina";
import { MonsterId } from "@/types/MonsterId";
import { ethers } from "ethers";

/**
 * Calculate stamina
 * @param timeStd time standard
 * @param staminaLimit stamina limit
 * @param staminaRecoveryTime stamina recovery time
 * @returns stamina
 */
export const calcStamina = (
  timeStd: ethers.BigNumber,
  staminaLimit: ethers.BigNumber,
  staminaRecoveryTime: ethers.BigNumber,
): number => {
  const timeStdNum = Number(timeStd);
  const staminaLimitNum = Number(staminaLimit);
  const staminaRecoveryTimeNum = Number(staminaRecoveryTime);
  if (timeStdNum === 0) return staminaLimitNum;
  const now = Math.floor(Date.now() / 1000);
  const stamina = Math.floor((now - timeStdNum) / staminaRecoveryTimeNum);
  if (stamina >= staminaLimitNum) return staminaLimitNum;
  return stamina;
};

/**
 * Calculate stamina from MonsterId
 * @param monsterId monster id
 * @returns stamina
 */
export const calcStaminaFromMonsterId = async (
  monsterId: MonsterId,
): Promise<number> => {
  if (monsterId === "") return MAX_STAMINA;
  const staminaContract = ServerStamina.instance(RPC_URL.mchVerse);
  const results = await Promise.all([
    staminaContract.getTimeStd(monsterId),
    staminaContract.getStaminaLimit(),
    staminaContract.getStaminaRecoveryTime(),
  ]);
  const timeStd = Number(results[0]);
  const staminaLimit = Number(results[1]);
  const staminaRecoveryTime = Number(results[2]);
  if (timeStd === 0) return staminaLimit;
  const now = Math.floor(Date.now() / 1000);
  const stamina = Math.floor((now - timeStd) / staminaRecoveryTime);
  if (stamina >= staminaLimit) return staminaLimit;
  return stamina;
};
