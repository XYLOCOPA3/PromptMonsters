import { ethers } from "ethers";

const mchVerse =
  process.env.NEXT_PUBLIC_IS_PRODUCTION === "true"
    ? "https://rpc.oasys.mycryptoheroes.net/" // mchMainnet
    : "https://rpc.sandverse.oasys.games/"; // sandverse
// : "https://rpc.oasys.sand.mchdfgh.xyz/"; // mchTestnet

export const RPC_URL = {
  mumbai: "https://rpc-mumbai.maticvigil.com/",
  linea: "https://rpc.goerli.linea.build",
  sandverse: "https://rpc.sandverse.oasys.games/",
  mchVerse: mchVerse,
};

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
