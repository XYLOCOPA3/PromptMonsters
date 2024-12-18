import { ServerWallet } from "@/lib/wallet/ServerWallet";
import { Battle, Battle__factory } from "@/typechain";
import { ethers } from "ethers";

export class ServerBattleContract {
  private static _instance: ServerBattleContract;

  private constructor(private readonly _battle: Battle) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerBattleContract} instance
   */
  public static instance(rpcURL: string): ServerBattleContract {
    if (!this._instance) {
      const wallet = ServerWallet.getWallet(rpcURL);
      const battle = Battle__factory.connect(
        process.env.NEXT_PUBLIC_BATTLE_CONTRACT!,
        wallet,
      );
      this._instance = new ServerBattleContract(battle);
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
    console.log(`battleSeasonId: ${battleSeasonId}`);
    const freeMonsterId = ethers.constants.MaxUint256;
    return await (
      await this._battle.addSeasonBattleData(
        ethers.BigNumber.from(battleSeasonId),
        monsterId === "" ? freeMonsterId : ethers.BigNumber.from(monsterId),
        winMonsterId === ""
          ? freeMonsterId
          : ethers.BigNumber.from(winMonsterId),
        loseMonsterId === ""
          ? freeMonsterId
          : ethers.BigNumber.from(loseMonsterId),
        battleLog,
      )
    ).wait();
  };
}
