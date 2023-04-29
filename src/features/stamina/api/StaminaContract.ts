import { ServerWallet } from "@/lib/wallet";
import { Stamina, Stamina__factory } from "@/typechain";
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
      const wallet = ServerWallet.instance(rpcURL);
      const stamina = Stamina__factory.connect(
        process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
        wallet.signer,
      );
      this._instance = new StaminaContract(stamina);
    }
    return this._instance;
  }

  /**
   * calculateStamina
   * @param monsterId monster id
   * @return {Promise<ethers.BigNumber>} stamina
   */
  calculateStamina = async (monsterId: string): Promise<ethers.BigNumber> => {
    return await this._stamina.calculateStamina(
      ethers.BigNumber.from(monsterId),
    );
  };

  /**
   * consumeStamina
   * @param monsterId
   * @param consumedStamina
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  consumeStamina = async (
    monsterId: string,
    consumedStamina: number,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._stamina.consumeStamina(
        ethers.BigNumber.from(monsterId),
        ethers.BigNumber.from(consumedStamina),
      )
    ).wait();
  };
}
