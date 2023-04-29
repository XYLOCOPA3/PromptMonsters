import { ServerWallet } from "@/lib/wallet";
import { Battle, Battle__factory } from "@/typechain";
import { ethers } from "ethers";

export class BattleContract {
  private static _instance: BattleContract;

  private constructor(private readonly _battle: Battle) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {BattleContract} instance
   */
  public static instance(rpcURL: string): BattleContract {
    if (!this._instance) {
      const wallet = ServerWallet.instance(rpcURL);
      const battle = Battle__factory.connect(
        process.env.NEXT_PUBLIC_BATTLE_CONTRACT!,
        wallet.signer,
      );
      this._instance = new BattleContract(battle);
    }
    return this._instance;
  }

  /**
   * addSeasonBattleData
   * @param monsterId monster id
   * @param winMonsterId win monster id
   * @param loseMonsterId lose monster ids
   * @param battleLog battle log
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  addSeasonBattleData = async (
    monsterId: string,
    winMonsterId: string,
    loseMonsterId: string,
    battleLog: string,
  ): Promise<ethers.ContractReceipt> => {
    const battleSeasonId = Number(process.env.BATTLE_SEASON_ID);
    console.log(battleSeasonId);
    return await (
      await this._battle.addSeasonBattleData(
        ethers.BigNumber.from(battleSeasonId),
        ethers.BigNumber.from(monsterId),
        ethers.BigNumber.from(winMonsterId),
        ethers.BigNumber.from(loseMonsterId),
        battleLog,
      )
    ).wait();
  };
}
