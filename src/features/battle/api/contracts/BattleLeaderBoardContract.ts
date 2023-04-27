import { ServerWallet } from "@/lib/wallet";
import { BattleLeaderBoard, BattleLeaderBoard__factory } from "@/typechain";
import { ethers } from "ethers";

export class BattleLeaderBoardContract {
  private static _instance: BattleLeaderBoardContract;

  private constructor(private readonly _battleLeaderBoard: BattleLeaderBoard) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {BattleLeaderBoardContract} instance
   */
  public static instance(rpcURL: string): BattleLeaderBoardContract {
    if (!this._instance) {
      const wallet = ServerWallet.instance(rpcURL);
      const battleLeaderBoard = BattleLeaderBoard__factory.connect(
        process.env.NEXT_PUBLIC_BATTLE_LEADER_BOARD_CONTRACT!,
        wallet.signer,
      );
      this._instance = new BattleLeaderBoardContract(battleLeaderBoard);
    }
    return this._instance;
  }

  /**
   * addBattleSeasonData
   * @param seasonId season id
   * @param winMonsterId win monster id
   * @param loseMonsterId lose monster ids
   * @param battleLog battle log
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  addBattleSeasonData = async (
    seasonId: number,
    winMonsterId: string,
    loseMonsterId: string,
    battleLog: string,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._battleLeaderBoard.addBattleSeasonData(
        seasonId,
        Number(winMonsterId),
        Number(loseMonsterId),
        battleLog,
      )
    ).wait();
  };

  //   /**
  //    * Get monster struct
  //    * @param monsterJson monster json
  //    * @return {MonsterModel} MonsterModel
  //    */
  //   toMonsterStruct = (monsterJson: any): IPromptMonsters.MonsterStruct => {
  //     const monster: IPromptMonsters.MonsterStruct = {
  //       name: monsterJson.name,
  //       flavor: monsterJson.flavor,
  //       skills: monsterJson.skills,
  //       lv: ethers.BigNumber.from(1),
  //       hp: ethers.BigNumber.from(monsterJson.status.HP),
  //       atk: ethers.BigNumber.from(monsterJson.status.ATK),
  //       def: ethers.BigNumber.from(monsterJson.status.DEF),
  //       inte: ethers.BigNumber.from(monsterJson.status.INT),
  //       mgr: ethers.BigNumber.from(monsterJson.status.MGR),
  //       agl: ethers.BigNumber.from(monsterJson.status.AGL),
  //       maxSkills: ethers.BigNumber.from(10),
  //       maxSkillsSet: ethers.BigNumber.from(4),
  //     };
  //     return monster;
  //   };

  //   /**
  //    * Get monsters
  //    * @param monsterId monster id
  //    * @return {Promise<IPromptMonsters.MonsterStructOutput[]>} monster struct output
  //    */
  //   getMonsters = async (
  //     monsterIds: string[],
  //   ): Promise<IPromptMonsters.MonsterStructOutput[]> => {
  //     const tokenIds: ethers.BigNumber[] = [];
  //     for (let i = 0; i < monsterIds.length; i++) {
  //       tokenIds.push(ethers.BigNumber.from(monsterIds[i]));
  //     }
  //     return await this._battleLeaderBoard.getMonsters(tokenIds);
  //   };
  //   /**
  //    * Get monsters total supply
  //    * @return {Promise<number>} monsters total supply
  //    */
  //   getMonstersTotalSupply = async (): Promise<number> => {
  //     return Number(await this._battleLeaderBoard.getMonstersTotalSupply());
  //   };
}
