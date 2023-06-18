import { ServerWallet } from "@/lib/wallet/ServerWallet";
import { Stamina, Stamina__factory } from "@/typechain";
import { ethers } from "ethers";

export class ServerStamina {
  private constructor(private readonly _contract: Stamina) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerStamina} instance
   */
  public static instance(rpcURL: string): ServerStamina {
    const wallet = ServerWallet.getWallet(rpcURL);
    const contract = Stamina__factory.connect(
      process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
      wallet,
    );
    return new ServerStamina(contract);
  }

  /**
   * getStaminaLimit
   * @return {Promise<ethers.BigNumber>} stamina limit
   */
  getStaminaLimit = async (): Promise<ethers.BigNumber> => {
    return await this._contract.staminaLimit();
  };

  /**
   * getStaminaRecoveryTime
   * @return {Promise<ethers.BigNumber>} stamina recovery time
   */
  getStaminaRecoveryTime = async (): Promise<ethers.BigNumber> => {
    return await this._contract.staminaRecoveryTime();
  };

  /**
   * getTimeStd
   * @param monsterId monster id
   * @return {Promise<ethers.BigNumber>} time std
   */
  getTimeStd = async (monsterId: string): Promise<ethers.BigNumber> => {
    return await this._contract.timeStd(ethers.BigNumber.from(monsterId));
  };
}
