import { ServerWallet } from "@/lib/wallet";
import { BossBattle, BossBattle__factory } from "@/typechain";
import { MonsterAdj } from "@/types/MonsterAdj";
import { ethers } from "ethers";

export class ServerBossBattle {
  private static _instance: ServerBossBattle;

  private constructor(private readonly _contract: BossBattle) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerBossBattle} instance
   */
  public static instance(rpcURL: string): ServerBossBattle {
    if (!this._instance) {
      const wallet = ServerWallet.instance(rpcURL);
      const contract = BossBattle__factory.connect(
        process.env.NEXT_PUBLIC_BOSS_BATTLE_CONTRACT!,
        wallet.signer,
      );
      this._instance = new ServerBossBattle(contract);
    }
    return this._instance;
  }

  /**
   * getMonsterAdj
   * @return {Promise<MonsterAdj>} monsterAdj
   */
  getMonsterAdj = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
  ): Promise<MonsterAdj> => {
    return await this._contract.getMonsterAdj(
      eventKey,
      bbeId,
      resurrectionPrompt,
    );
  };

  /**
   * mint
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  setMonsterAdj = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
    monsterAdj: MonsterAdj,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.setMonsterAdj(
        eventKey,
        bbeId,
        resurrectionPrompt,
        monsterAdj,
      )
    ).wait();
  };
}
