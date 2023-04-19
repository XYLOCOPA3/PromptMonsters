import { BasePromptMonstersContract } from "@/features/monster/api/contracts/BasePromptMonstersContract";
import { ServerWallet } from "@/lib/wallet";
import { UserId } from "@/types/UserId";
import {
  PromptMonsters,
  PromptMonsters__factory,
} from "types/ethers-contracts";
import { IPromptMonsters } from "types/ethers-contracts/PromptMonsters";

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
        "0x2fB0455276cB8577458a97033E9cb7245aa3CAD3", // linea
        wallet.signer,
      );
      this._instance = new ServerPromptMonstersContract(promptMonsters);
    }
    return this._instance;
  }

  /**
   * getOwnerToTokenIds
   * @return {Promise<UserId>} user id
   */
  getOwnerToTokenIds = async (userId: UserId): Promise<bigint[]> => {
    const ids = await this._promptMonsters.getOwnerToTokenIds(userId);
    const tokenIds: bigint[] = [];
    for (let i = 0; i < ids.length; i++) {
      tokenIds.push(ids[i]);
    }
    return tokenIds;
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
