import { ServerWallet } from "@/lib/wallet/ServerWallet";
import { PromptMonsters, PromptMonsters__factory } from "@/typechain";
import {
  IPromptMonsters,
  IPromptMonstersExtension,
} from "@/typechain/PromptMonsters";
import { ethers } from "ethers";

export class ServerPromptMonsters {
  private static _instance: ServerPromptMonsters;

  private constructor(private readonly _contract: PromptMonsters) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerPromptMonsters} instance
   */
  public static instance(rpcURL: string): ServerPromptMonsters {
    if (!this._instance) {
      const wallet = ServerWallet.getWallet(rpcURL);
      const contract = PromptMonsters__factory.connect(
        process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
        wallet,
      );
      this._instance = new ServerPromptMonsters(contract);
    }
    return this._instance;
  }

  /**
   * generateMonster
   * @param userId user id
   * @param monster monster content
   * @param feature feature
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  generateMonster = async (
    userId: string,
    monster: any,
    feature: string,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.generateMonster(
        userId,
        this.toMonsterStruct(monster, feature),
      )
    ).wait();
  };

  /**
   * Get monster struct
   * @param monsterJson monster json
   * @param feature feature
   * @return {MonsterModel} MonsterModel
   */
  toMonsterStruct = (
    monsterJson: any,
    feature: string,
  ): IPromptMonsters.MonsterStruct => {
    const monster: IPromptMonsters.MonsterStruct = {
      feature: feature,
      name: monsterJson.name,
      flavor: monsterJson.flavor,
      skills: monsterJson.skills,
      lv: ethers.BigNumber.from(1),
      hp: ethers.BigNumber.from(monsterJson.status.HP),
      atk: ethers.BigNumber.from(monsterJson.status.ATK),
      def: ethers.BigNumber.from(monsterJson.status.DEF),
      inte: ethers.BigNumber.from(monsterJson.status.INT),
      mgr: ethers.BigNumber.from(monsterJson.status.MGR),
      agl: ethers.BigNumber.from(monsterJson.status.AGL),
    };
    return monster;
  };

  /**
   * Get monsters total supply
   * @return {Promise<number>} monsters total supply
   */
  getMonstersTotalSupply = async (): Promise<number> => {
    return Number(await this._contract.getMonstersTotalSupply());
  };

  /**
   * getMonsterExtensions
   * @param resurrectionPrompts resurrection prompts
   * @return {Promise<IPromptMonstersExtension.MonsterExtensionStructOutput>} monster extension struct output
   */
  getMonsterExtensions = async (
    resurrectionPrompts: string[],
  ): Promise<IPromptMonstersExtension.MonsterExtensionStructOutput[]> => {
    return await this._contract.getMonsterExtensions(resurrectionPrompts);
  };

  /**
   * Get monster mint price
   * @return {Promise<ethers.BigNumber>} monster mint price
   */
  getMintPrice = async (): Promise<ethers.BigNumber> => {
    return await this._contract.getMintPrice();
  };

  /**
   * getResurrectionPrompts
   * @return {Promise<string[]>} resurrectionPrompts
   */
  getResurrectionPrompts = async (monsterIds: string[]): Promise<string[]> => {
    const monsterIdsBN: ethers.BigNumber[] = [];
    for (let i = 0; i < monsterIds.length; i++) {
      monsterIdsBN.push(ethers.BigNumber.from(monsterIds[i]));
    }
    return await this._contract.getResurrectionPrompts(monsterIdsBN);
  };

  /**
   * getTokenIds
   * @return {Promise<string[]>} tokenIds
   */
  getTokenIds = async (resurrectionPrompts: string[]): Promise<string[]> => {
    const monsterIdsBN = await this._contract.getTokenIds(resurrectionPrompts);
    const monsterIds: string[] = [];
    for (let i = 0; i < resurrectionPrompts.length; i++) {
      monsterIds.push(monsterIdsBN[i].toString());
    }
    return monsterIds;
  };
}
