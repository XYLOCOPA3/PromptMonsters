import { ClientWallet } from "@/lib/wallet/ClientWallet";
import { PromptMonsters, PromptMonsters__factory } from "@/typechain";
import { IPromptMonstersExtension } from "@/typechain/PromptMonsters";
import { MonsterId } from "@/types/MonsterId";
import { ethers } from "ethers";

export class ClientPromptMonsters {
  private static _instance: ClientPromptMonsters;
  private _writer?: PromptMonsters;

  private constructor(
    private readonly _wallet: ClientWallet,
    private readonly _reader: PromptMonsters,
  ) {}

  /**
   * Get instance
   * @return {ClientPromptMonsters} instance
   */
  public static instance(): ClientPromptMonsters {
    if (!this._instance) {
      const wallet = ClientWallet.instance();
      const reader = PromptMonsters__factory.connect(
        process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
        wallet.provider,
      );
      this._instance = new ClientPromptMonsters(wallet, reader);
    }
    return this._instance;
  }

  /**
   * getMintPrice
   * @return {Promise<ethers.BigNumber>} mint price
   */
  getMintPrice = async (): Promise<ethers.BigNumber> => {
    return await this._reader.getMintPrice();
  };

  /**
   * getOwnerToTokenIds
   * @param userId user id
   * @return {Promise<ethers.BigNumber[]>} token ids
   */
  getOwnerToTokenIds = async (userId: string): Promise<ethers.BigNumber[]> => {
    return await this._reader.getOwnerToTokenIds(userId);
  };

  /**
   * mint
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  mint = async (
    resurrectionPrompt: string,
  ): Promise<ethers.ContractReceipt> => {
    await this._beforeWrite();
    return await (await this._writer!.mint(resurrectionPrompt)).wait();
  };

  /**
   * getMonsterExtensions
   * @param resurrectionPrompts resurrection prompts
   * @return {Promise<IPromptMonstersExtension.MonsterExtensionStructOutput>} monster extension struct output
   */
  getMonsterExtensions = async (
    resurrectionPrompts: string[],
  ): Promise<IPromptMonstersExtension.MonsterExtensionStructOutput[]> => {
    return await this._reader.getMonsterExtensions(resurrectionPrompts);
  };

  /**
   * getResurrectionPrompts
   * @param monsterIds monster ids
   * @return {Promise<string[]>} resurrection prompts
   */
  getResurrectionPrompts = async (
    monsterIds: MonsterId[],
  ): Promise<string[]> => {
    const monsterIdsNum: ethers.BigNumber[] = [];
    for (let i = 0; i < monsterIds.length; i++) {
      monsterIdsNum.push(ethers.BigNumber.from(monsterIds[i]));
    }
    return await this._reader.getResurrectionPrompts(monsterIdsNum);
  };

  /**
   * getTokenIds
   * @return {Promise<string[]>} tokenIds
   */
  getTokenIds = async (resurrectionPrompts: string[]): Promise<string[]> => {
    const monsterIdsBN = await this._reader.getTokenIds(resurrectionPrompts);
    const monsterIds: string[] = [];
    for (let i = 0; i < resurrectionPrompts.length; i++) {
      monsterIds.push(monsterIdsBN[i].toString());
    }
    return monsterIds;
  };

  /**
   * Before write
   */
  private _beforeWrite = async (): Promise<void> => {
    const connectedAddressList = await this._wallet.getConnectedAddresses();
    if (connectedAddressList.length === 0)
      throw Error("Not found connected address.");
    if (this._writer !== undefined) return;
    this._writer = PromptMonsters__factory.connect(
      this._reader.address,
      await this._wallet.getSigner(),
    );
  };
}
