import { ClientWallet } from "@/lib/wallet/ClientWallet";
import { Stamina, Stamina__factory } from "@/typechain";
import { ethers } from "ethers";

export class ClientStamina {
  private static _instance: ClientStamina;
  private _writer?: Stamina;

  private constructor(
    private readonly _wallet: ClientWallet,
    private readonly _reader: Stamina,
  ) {}

  /**
   * Get instance
   * @return {ClientStamina} instance
   */
  public static instance(): ClientStamina {
    if (!this._instance) {
      const wallet = ClientWallet.instance();
      const reader = Stamina__factory.connect(
        process.env.NEXT_PUBLIC_STAMINA_CONTRACT!,
        wallet.provider,
      );
      this._instance = new ClientStamina(wallet, reader);
    }
    return this._instance;
  }

  /**
   * getStaminaLimit
   * @return {Promise<ethers.BigNumber>} stamina limit
   */
  getStaminaLimit = async (): Promise<ethers.BigNumber> => {
    return await this._reader.staminaLimit();
  };

  /**
   * restoreStamina
   * @param monsterId monster id
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  restoreStamina = async (
    monsterId: string,
  ): Promise<ethers.ContractReceipt> => {
    await this._beforeWrite();
    return await (await this._writer!.restoreStamina(monsterId)).wait();
  };

  /**
   * Before write
   */
  private _beforeWrite = async (): Promise<void> => {
    const connectedAddressList = await this._wallet.getConnectedAddresses();
    if (connectedAddressList.length === 0)
      throw Error("Not found connected address.");
    if (this._writer !== undefined) return;
    this._writer = Stamina__factory.connect(
      this._reader.address,
      await this._wallet.getSigner(),
    );
  };
}
