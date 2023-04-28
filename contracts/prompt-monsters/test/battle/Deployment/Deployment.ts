import { deployBattle } from "./Battle";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { promptMonsters, erc20, battle, battleS1 } = await loadFixture(
    deployBattle,
  );

  return {
    promptMonsters,
    erc20,
    battle,
    battleS1,
  };
}
