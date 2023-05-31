import { ClientWallet } from "@/lib/wallet/client";
import { MCHCoin, MCHCoin__factory } from "@/typechain";
import { ethers } from "ethers";

export class ClientMCHCoin {
  private static _instance: ClientMCHCoin;
  private _writer?: MCHCoin;

  private constructor(
    private readonly _wallet: ClientWallet,
    private readonly _reader: MCHCoin,
  ) {}

  /**
   * Get instance
   * @return {ClientMCHCoin} instance
   */
  public static instance(): ClientMCHCoin {
    if (!this._instance) {
      const wallet = ClientWallet.instance();
      const reader = MCHCoin__factory.connect(
        process.env.NEXT_PUBLIC_MCHCOIN_CONTRACT!,
        wallet.provider,
      );
      this._instance = new ClientMCHCoin(wallet, reader);
    }
    return this._instance;
  }

  /**
   * getBalanceOf
   * @param userId user id
   * @return {Promise<ethers.BigNumber>} token ids
   */
  getBalanceOf = async (userId: string): Promise<ethers.BigNumber> => {
    return await this._reader.balanceOf(userId);
  };

  /**
   * getAllowance
   * @param userId user id
   * @param addr address
   * @return {Promise<ethers.BigNumber>} allowance
   */
  getAllowance = async (
    userId: string,
    addr: string,
  ): Promise<ethers.BigNumber> => {
    return await this._reader.allowance(userId, addr);
  };

  /**
   * approve
   * @param addr address
   * @param amount amount
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  approve = async (
    addr: string,
    amount: ethers.BigNumber,
  ): Promise<ethers.ContractReceipt> => {
    await this._beforeWrite();
    return await (await this._writer!.approve(addr, amount)).wait();
  };

  /**
   * Before write
   */
  private _beforeWrite = async (): Promise<void> => {
    const connectedAddressList = await this._wallet.getConnectedAddresses();
    if (connectedAddressList.length === 0)
      throw Error("Not found connected address.");
    if (this._writer !== undefined) return;
    this._writer = MCHCoin__factory.connect(
      this._reader.address,
      await this._wallet.getSigner(),
    );
  };
}
