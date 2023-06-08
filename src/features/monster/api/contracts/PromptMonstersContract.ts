import { ServerWallet } from "@/lib/wallet";
import { PromptMonsters, PromptMonsters__factory } from "@/typechain";
import {
  IPromptMonsters,
  IPromptMonstersExtension,
} from "@/typechain/PromptMonsters";
import { ethers } from "ethers";

export class PromptMonstersContract {
  private static _instance: PromptMonstersContract;

  private constructor(private readonly _promptMonsters: PromptMonsters) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {PromptMonstersContract} instance
   */
  public static instance(rpcURL: string): PromptMonstersContract {
    if (!this._instance) {
      const wallet = ServerWallet.instance(rpcURL);
      const promptMonsters = PromptMonsters__factory.connect(
        process.env.NEXT_PUBLIC_PROMPT_MONSTERS_CONTRACT!,
        wallet.signer,
      );
      this._instance = new PromptMonstersContract(promptMonsters);
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
      await this._promptMonsters.generateMonster(
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
    return Number(await this._promptMonsters.getMonstersTotalSupply());
  };

  /**
   * getMonsterExtensions
   * @param resurrectionPrompts resurrection prompts
   * @return {Promise<IPromptMonstersExtension.MonsterExtensionStructOutput>} monster extension struct output
   */
  getMonsterExtensions = async (
    resurrectionPrompts: string[],
  ): Promise<IPromptMonstersExtension.MonsterExtensionStructOutput[]> => {
    return await this._promptMonsters.getMonsterExtensions(resurrectionPrompts);
  };

  /**
   * Get monster mint price
   * @return {Promise<number>} monster mint price
   */
  getMintPrice = async (): Promise<number> => {
    return Number(await this._promptMonsters.getMintPrice());
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
    return await this._promptMonsters.getResurrectionPrompts(monsterIdsBN);
  };
}
