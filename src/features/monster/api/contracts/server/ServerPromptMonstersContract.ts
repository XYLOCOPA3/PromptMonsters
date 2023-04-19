import { BasePromptMonstersContract } from "@/features/monster/api/contracts/BasePromptMonstersContract";
import { ServerWallet } from "@/lib/wallet";
import { PromptMonsters, PromptMonsters__factory } from "@/typechain";
import { IPromptMonsters } from "@/typechain/PromptMonsters";
import { UserId } from "@/types/UserId";
import { ethers } from "ethers";

export class ServerPromptMonstersContract extends BasePromptMonstersContract {
  private static _instance: ServerPromptMonstersContract;

  private constructor(private readonly _promptMonsters: PromptMonsters) {
    super();
  }

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerPromptMonstersContract} instance
   */
  public static instance(rpcURL: string): ServerPromptMonstersContract {
    if (!this._instance) {
      const wallet = ServerWallet.instance(rpcURL);
      const promptMonsters = PromptMonsters__factory.connect(
        process.env.PROMPT_MONSTERS_CONTRACT!,
        wallet.signer,
      );
      this._instance = new ServerPromptMonstersContract(promptMonsters);
    }
    return this._instance;
  }

  /**
   * getOwnerToTokenIds
   * @return {Promise<BigNumber[]>} token ids
   */
  getOwnerToTokenIds = async (userId: UserId): Promise<ethers.BigNumber[]> => {
    return await this._promptMonsters.getOwnerToTokenIds(userId);
  };

  /**
   * getOwnerToTokenIds
   * @return {Promise<bigint[]>} token ids
   */
  getMonsters = async (
    tokenIds: bigint[],
  ): Promise<IPromptMonsters.MonsterStructOutput[]> => {
    return await this._promptMonsters.getMonsters([0]);
  };
}
