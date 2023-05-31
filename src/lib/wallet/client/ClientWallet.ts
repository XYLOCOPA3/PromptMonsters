import { ethers } from "ethers";

export class ClientWallet {
  private static _instance: ClientWallet;
  private constructor(
    public readonly provider: ethers.providers.Web3Provider,
  ) {}

  /**
   * Create instance
   * @return {ClientWallet} instance
   */
  public static instance(): ClientWallet {
    if (!this._instance) {
      const { ethereum } = window as any;
      if (!_isInstallWallet(ethereum)) throw new Error("Not found wallet.");
      const provider = new ethers.providers.Web3Provider(ethereum);
      this._instance = new ClientWallet(provider);
    }
    return this._instance;
  }

  /**
   * Get connected wallet address
   * @return {Promise<string[]>} connected wallet address
   */
  getConnectedAddresses = async (): Promise<string[]> => {
    return await this.provider.send("eth_accounts", []);
  };

  /**
   * Get signer
   * @return {Promise<ethers.providers.JsonRpcSigner>} signer
   */
  getSigner = async (): Promise<ethers.providers.JsonRpcSigner> => {
    return this.provider.getSigner();
  };
}

/**
 * Is install wallet
 * @param ethereum window.ethereum
 * @return {boolean} is install wallet
 */
const _isInstallWallet = (ethereum: any): boolean => {
  return typeof ethereum !== "undefined";
};
