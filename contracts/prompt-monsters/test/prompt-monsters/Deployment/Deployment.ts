import { deployPromptMonsters } from "./PromptMonsters";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { promptMonsters, mchCoin } = await loadFixture(deployPromptMonsters);

  return {
    promptMonsters,
    mchCoin,
  };
}
