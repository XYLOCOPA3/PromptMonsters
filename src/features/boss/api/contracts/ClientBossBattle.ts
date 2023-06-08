import { ClientWallet } from "@/lib/wallet/client";
import { BossBattle, BossBattle__factory } from "@/typechain";
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
