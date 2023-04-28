import { deployPromptMonsters } from "./PromptMonsters";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { promptMonsters, erc20 } = await loadFixture(deployPromptMonsters);

  return {
    promptMonsters,
    erc20,
  };
}
