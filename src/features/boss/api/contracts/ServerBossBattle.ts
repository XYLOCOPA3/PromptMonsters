import { ServerWallet } from "@/lib/wallet/ServerWallet";
import { BossBattle, BossBattle__factory } from "@/typechain";
import {
  IBossBattleEvent,
  IPromptMonstersExtension,
} from "@/typechain/BossBattle";
import { BBState } from "@/types/BBState";
import { MonsterAdj } from "@/types/MonsterAdj";
import { ethers } from "ethers";

export class ServerBossBattle {
  private constructor(private readonly _contract: BossBattle) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerBossBattle} instance
   */
  public static instance(rpcURL: string): ServerBossBattle {
    const wallet = ServerWallet.getWallet(rpcURL);
    const contract = BossBattle__factory.connect(
      process.env.NEXT_PUBLIC_BOSS_BATTLE_CONTRACT!,
      wallet,
    );
    return new ServerBossBattle(contract);
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
   * setMonsterAdj
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

  /**
   * startBossBattle
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  startBossBattle = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
    monsterAdj: number,
    bossSign: number,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.startBossBattle(
        eventKey,
        bbeId,
        resurrectionPrompt,
        monsterAdj,
        bossSign,
      )
    ).wait();
  };

  /**
   * updateBossBattleResult
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  updateBossBattleResult = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
    bbState: BBState,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.updateBossBattleResult(
        eventKey,
        bbeId,
        resurrectionPrompt,
        bbState,
      )
    ).wait();
  };

  /**
   * continueBossBattle
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  continueBossBattle = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
    bossSign: number,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.continueBossBattle(
        eventKey,
        bbeId,
        resurrectionPrompt,
        bossSign,
      )
    ).wait();
  };

  /**
   * endBossBattle
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  endBossBattle = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.endBossBattle(eventKey, bbeId, resurrectionPrompt)
    ).wait();
  };

  /**
   * getBossExtension
   * @return {Promise<MonsterAdj>} monsterAdj
   */
  getBossExtension = async (
    eventKey: string,
    bbeId: number,
    language: string,
  ): Promise<IPromptMonstersExtension.MonsterExtensionStructOutput> => {
    return await this._contract.getBossExtension(eventKey, bbeId, language);
  };

  /**
   * getBBState
   * @return {Promise<BBState>} bbState
   */
  getBBState = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
  ): Promise<BBState> => {
    return this.toBBState(
      await this._contract.getBBState(eventKey, bbeId, resurrectionPrompt),
    );
  };

  /**
   * toBBState
   * @return {BBState} bbState
   */
  toBBState = (data: IBossBattleEvent.BBStateStructOutput): BBState => {
    return {
      bossBattleStarted: data.bossBattleStarted,
      bossBattleContinued: data.bossBattleContinued,
      lp: data.lp,
      turn: data.turn,
      score: data.score,
      monsterAdj: data.monsterAdj,
      bossAdj: data.bossAdj,
      bossSign: data.bossSign,
      hasHealItem: data.hasHealItem,
      hasBuffItem: data.hasBuffItem,
      hasDebuffItem: data.hasDebuffItem,
      hasEscapeItem: data.hasEscapeItem,
    };
  };

  // TODO: 後で消す（開発用）
  /**
   * deleteBBState
   * @param resurrectionPrompt resurrection prompt
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  deleteBBState = async (
    eventKey: string,
    bbeId: number,
    resurrectionPrompt: string,
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.deleteBBState(eventKey, bbeId, resurrectionPrompt)
    ).wait();
  };
}
