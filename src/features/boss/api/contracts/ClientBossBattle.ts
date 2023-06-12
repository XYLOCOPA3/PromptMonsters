import { ClientWallet } from "@/lib/wallet/ClientWallet";
import { BossBattle, BossBattle__factory } from "@/typechain";
import {
  IBossBattleEvent,
  IPromptMonstersExtension,
} from "@/typechain/BossBattle";
import { BBState } from "@/types/BBState";
import { MonsterAdj } from "@/types/MonsterAdj";
import axios from "axios";

export class ClientBossBattle {
  private static _instance: ClientBossBattle;
  private _writer?: BossBattle;

  private constructor(
    private readonly _wallet: ClientWallet,
    private readonly _reader: BossBattle,
    private readonly _eventKey: string,
    private readonly _bbeId: number,
  ) {}

  /**
   * Get instance
   * @return {Promise<ClientBossBattle>} instance
   */
  public static async instance(): Promise<ClientBossBattle> {
    if (!this._instance) {
      const wallet = ClientWallet.instance();
      const reader = BossBattle__factory.connect(
        process.env.NEXT_PUBLIC_BOSS_BATTLE_CONTRACT!,
        wallet.provider,
      );
      const res = await axios.post("/api/boss/get-event");
      const eventKey = res.data.eventKey;
      const bbeId = res.data.bbeId;
      this._instance = new ClientBossBattle(wallet, reader, eventKey, bbeId);
    }
    return this._instance;
  }

  /**
   * getMonsterAdj
   * @return {Promise<MonsterAdj>} monsterAdj
   */
  getMonsterAdj = async (resurrectionPrompt: string): Promise<MonsterAdj> => {
    return await this._reader.getMonsterAdj(
      this._eventKey,
      this._bbeId,
      resurrectionPrompt,
    );
  };

  /**
   * getBossExtension
   * @return {Promise<MonsterAdj>} monsterAdj
   */
  getBossExtension = async (
    language: string,
  ): Promise<IPromptMonstersExtension.MonsterExtensionStructOutput> => {
    return await this._reader.getBossExtension(
      this._eventKey,
      this._bbeId,
      language,
    );
  };

  /**
   * getBBState
   * @return {Promise<BBState>} bbState
   */
  getBBState = async (resurrectionPrompt: string): Promise<BBState> => {
    return this.toBBState(
      await this._reader.getBBState(
        this._eventKey,
        this._bbeId,
        resurrectionPrompt,
      ),
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

  /**
   * Before write
   */
  private _beforeWrite = async (): Promise<void> => {
    const connectedAddressList = await this._wallet.getConnectedAddresses();
    if (connectedAddressList.length === 0)
      throw Error("Not found connected address.");
    if (this._writer !== undefined) return;
    this._writer = BossBattle__factory.connect(
      this._reader.address,
      await this._wallet.getSigner(),
    );
  };
}
