import { ethers } from "ethers";

export class ServerWallet {
  private static _instance: ServerWallet;

  private constructor(
    public readonly provider: ethers.providers.JsonRpcProvider,
    public readonly signer: ethers.Wallet,
  ) {}

  /**
   * Get instance
   * @return {ServerWallet} instance
   */
  public static instance(rpcURL: string): ServerWallet {
    if (!this._instance) {
      const provider = new ethers.providers.JsonRpcProvider(rpcURL);
      const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY as string,
        provider,
      );
      this._instance = new ServerWallet(provider, signer);
    }
    return this._instance;
  }
}