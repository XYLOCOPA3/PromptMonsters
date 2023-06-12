import { ServerWallet } from "@/lib/wallet/ServerWallet";
import {
  PromptMonstersExtension,
  PromptMonstersExtension__factory,
} from "@/typechain";
import { ethers } from "ethers";

export class ServerPromptMonstersExtension {
  private static _instance: ServerPromptMonstersExtension;

  private constructor(private readonly _contract: PromptMonstersExtension) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerPromptMonstersExtension} instance
   */
  public static instance(rpcURL: string): ServerPromptMonstersExtension {
    if (!this._instance) {
      const wallet = ServerWallet.instance(rpcURL);
      const contract = PromptMonstersExtension__factory.connect(
        process.env.NEXT_PUBLIC_PROMPT_MONSTERS_EXTENSION_CONTRACT!,
        wallet.signer,
      );
      this._instance = new ServerPromptMonstersExtension(contract);
    }
    return this._instance;
  }

  /**
   * setBatchSkillTypes
   * @param resurrectionPrompts resurrection prompts
   * @param skills skills
   * @param skillTypes skill types
   * @return {Promise<ethers.ContractReceipt>} contract receipt
   */
  setBatchSkillTypes = async (
    resurrectionPrompts: string[],
    skills: string[][],
    skillTypes: number[][],
  ): Promise<ethers.ContractReceipt> => {
    return await (
      await this._contract.setBatchSkillTypes(
        resurrectionPrompts,
        skills,
        skillTypes,
      )
    ).wait();
  };
}
