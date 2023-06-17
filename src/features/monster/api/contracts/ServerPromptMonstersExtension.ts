import { ServerWallet } from "@/lib/wallet/ServerWallet";
import {
  PromptMonstersExtension,
  PromptMonstersExtension__factory,
} from "@/typechain";
import { ethers } from "ethers";

export class ServerPromptMonstersExtension {
  private constructor(private readonly _contract: PromptMonstersExtension) {}

  /**
   * Get instance
   * @param rpcURL RPC URL
   * @return {ServerPromptMonstersExtension} instance
   */
  public static instance(rpcURL: string): ServerPromptMonstersExtension {
    const wallet = ServerWallet.getWallet(rpcURL);
    const contract = PromptMonstersExtension__factory.connect(
      process.env.NEXT_PUBLIC_PROMPT_MONSTERS_EXTENSION_CONTRACT!,
      wallet,
    );
    return new ServerPromptMonstersExtension(contract);
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
