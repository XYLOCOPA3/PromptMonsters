import { ethers } from "ethers";

export class ServerWallet {
  public static readonly CNT_WALLET = 100;
  public static seedCnt = -1;

  private constructor() {}

  /**
   * Get wallet
   * nonce has been used 対策済みウォレットアドレス取得
   * @return {ethers.Wallet} wallet
   */
  public static getWallet(rpcURL: string): ethers.Wallet {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    ServerWallet.seedCnt++;
    const signer = ethers.Wallet.fromMnemonic(
      process.env.GAME_ROLE_MNEMONIC!,
      `m/44'/60'/0'/0/${ServerWallet.seedCnt % ServerWallet.CNT_WALLET}`,
    ).connect(provider);
    // TODO: 後で消す
    console.log(`ServerWallet: ${ServerWallet.seedCnt}`);
    return signer;
  }
}
