import { deployBattleOffSeason } from "./BattleOffSeason";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { battleOffSeason, battle } = await loadFixture(deployBattleOffSeason);

  return {
    battleOffSeason,
    battle,
  };
}
