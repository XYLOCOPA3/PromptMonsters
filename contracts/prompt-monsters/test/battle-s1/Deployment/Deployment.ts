import { deployBattleS1 } from "./BattleS1";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { battleS1, battle } = await loadFixture(deployBattleS1);

  return {
    battleS1,
    battle,
  };
}
