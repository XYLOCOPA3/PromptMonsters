import { RPC_URL } from "@/const/chainParams";
import { ethers } from "ethers";

export class ClientWallet {
  private static _instance: ClientWallet;
  private constructor(
    public readonly provider: ethers.providers.JsonRpcProvider,
  ) {}

  /**
   * Create instance
   * @return {ClientWallet} instance
   */
  public static instance(): ClientWallet {
    if (!this._instance) {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL.mchVerse);
      this._instance = new ClientWallet(provider);
    }
    return this._instance;
  }

  /**
   * Get connected wallet address
   * @return {Promise<string[]>} connected wallet address
   */
  getConnectedAddresses = async (): Promise<string[]> => {
    const { ethereum } = window as any;
    if (!_isInstallWallet(ethereum)) throw new Error("Not found wallet.");
    const provider = new ethers.providers.Web3Provider(ethereum);
    return await provider.send("eth_accounts", []);
  };

  /**
   * Get signer
   * @return {Promise<ethers.providers.JsonRpcSigner>} signer
   */
  getSigner = async (): Promise<ethers.providers.JsonRpcSigner> => {
    const { ethereum } = window as any;
    if (!_isInstallWallet(ethereum)) throw new Error("Not found wallet.");
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider.getSigner();
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
