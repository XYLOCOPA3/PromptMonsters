import { ServerWallet } from "@/lib/wallet";
import { Stamina, Stamina__factory } from "@/typechain";
import { MonsterId } from "@/types/MonsterId";
import { ethers } from "ethers";

export class StaminaContract {
  private static _instance: StaminaContract;

  private constructor(private readonly _stamina: Stamina) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {StaminaContract} instance
   */
  public static instance(rpcURL: string): StaminaContract {
    if (!this._instance) {
      this._instance = new StaminaContract(
        Stamina__factory.connect(
          process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
          ServerWallet.instance(rpcURL).signer,
        ),
      );
    }
    return this._instance;
  }

  /**
   * Get stamina limit
   * @return {Promise<ethers.BigNumber>} stamina limit
   */
  getStaminaLimit = async (): Promise<ethers.BigNumber> => {
    return await this._stamina.staminaLimit();
  };

  /**
   * Get stamina recovery time
   * @return {Promise<ethers.BigNumber>} stamina recovery time
   */
  getStaminaRecoveryTime = async (): Promise<ethers.BigNumber> => {
    return await this._stamina.staminaRecoveryTime();
  };

  /**
   * Get stamina recovery time
   * @param monsterId monster id
   * @return {Promise<ethers.BigNumber>} stamina recovery time
   */
  getTimeStd = async (monsterId: MonsterId): Promise<ethers.BigNumber> => {
    return await this._stamina.getTimeStd(ethers.BigNumber.from(monsterId));
  };
}
