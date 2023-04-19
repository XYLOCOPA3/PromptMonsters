import { BasePromptMonstersContract } from "@/features/monster/api/contracts/BasePromptMonstersContract";
import { ClientWallet } from "@/lib/wallet";
import { MonsterModel } from "@/models/MonsterModel";
import { UserId } from "@/types/UserId";
import { ethers } from "ethers";
import {
  PromptMonsters,
  PromptMonsters__factory,
} from "types/ethers-contracts";
import { IPromptMonsters } from "types/ethers-contracts/PromptMonsters";

export class ClientPromptMonstersContract extends BasePromptMonstersContract {
  private _writer?: PromptMonsters;

  private constructor(
    private readonly _wallet: ClientWallet,
    private readonly _reader: PromptMonsters,
    public readonly contractAddress: string,
  ) {
    super();
  }

  /**
   * Create instance
   * @param contractAddress contract address
   * @return {Promise<ClientPromptMonstersContract>} instance
   */
  public static async instance(): Promise<ClientPromptMonstersContract> {
    const wallet = await ClientWallet.instance();
    const reader = PromptMonsters__factory.connect(
      // PROMPT_MONSTER_ADDRESS,
      // "0xA821411988D5E9dbf6614fDd1eD81d19392e0b93", // mumbai
      "0x2fB0455276cB8577458a97033E9cb7245aa3CAD3", // linea
      wallet.provider,
    );
    return new ClientPromptMonstersContract(
      wallet,
      reader,
      // PROMPT_MONSTER_ADDRESS,
      // "0xA821411988D5E9dbf6614fDd1eD81d19392e0b93", // mumbai
      "0x2fB0455276cB8577458a97033E9cb7245aa3CAD3", // linea
    );
  }

  /**
   * getMonstersTotalSupply
   */
  getMonstersTotalSupply = async (): Promise<number> => {
    return Number(await this._reader.getMonstersTotalSupply());
  };

  /**
   * getOwnerToTokenIds
   * @return {Promise<UserId>} user id
   */
  getOwnerToTokenIds = async (userId: UserId): Promise<bigint[]> => {
    const ids = await this._reader.getOwnerToTokenIds(userId);
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
    return await this._reader.getMonsters(tokenIds);
  };

  /**
   * Get
   * @return {Promise<ethers.ContractTransactionReceipt | null>} transaction receipt
   */
  mint = async (
    monster: MonsterModel,
  ): Promise<ethers.ContractTransactionReceipt | null> => {
    await this._beforeWrite();
    const monsterStruct = this.toMonsterStruct(monster);
    return await (await this._writer!.mint(monsterStruct)).wait();
  };

  /**
   * Before write
   */
  private _beforeWrite = async (): Promise<void> => {
    const connectedAddressList = await this._wallet.getConnectedAddresses();
    if (connectedAddressList.length === 0) throw Error("Please connect wallet");
    if (this._writer !== undefined) return;
    const results = await Promise.all([
      this._reader.getAddress(),
      this._wallet.getSigner(),
    ]);
    this._writer = PromptMonsters__factory.connect(results[0], results[1]);
  };
}
