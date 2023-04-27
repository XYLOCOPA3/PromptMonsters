import { deployBattleOffSeason } from "./BattleOffSeason";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { battleOffSeason, battleLeaderBoard } = await loadFixture(
    deployBattleOffSeason,
  );

  return {
    battleOffSeason,
    battleLeaderBoard,
  };
}
