import { ServerWallet } from "@/lib/wallet";
import { PromptMonsters, PromptMonsters__factory } from "@/typechain";
import { IPromptMonsters } from "@/typechain/PromptMonsters";
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
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  generateMonster = async (
    userId: string,
    monster: any,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._promptMonsters.generateMonster(
        userId,
        this.toMonsterStruct(monster),
      )
    ).wait();
  };

  /**
   * Get monster struct
   * @param monsterJson monster json
   * @return {MonsterModel} MonsterModel
   */
  toMonsterStruct = (monsterJson: any): IPromptMonsters.MonsterStruct => {
    const monster: IPromptMonsters.MonsterStruct = {
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
      maxSkills: ethers.BigNumber.from(10),
      maxSkillsSet: ethers.BigNumber.from(4),
    };
    return monster;
  };

  /**
   * Get monsters
   * @param monsterId monster id
   * @return {Promise<IPromptMonsters.MonsterStructOutput[]>} monster struct output
   */
  getMonsters = async (
    monsterIds: string[],
  ): Promise<IPromptMonsters.MonsterStructOutput[]> => {
    const tokenIds: ethers.BigNumber[] = [];
    for (let i = 0; i < monsterIds.length; i++) {
      tokenIds.push(ethers.BigNumber.from(monsterIds[i]));
    }
    return await this._promptMonsters.getMonsters(tokenIds);
  };
  /**
   * Get monsters total supply
   * @return {Promise<number>} monsters total supply
   */
  getMonstersTotalSupply = async (): Promise<number> => {
    return Number(await this._promptMonsters.getMonstersTotalSupply());
  };
}
