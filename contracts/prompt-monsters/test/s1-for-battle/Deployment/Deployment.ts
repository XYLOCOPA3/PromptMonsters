import { deployS1ForBattle } from "./S1ForBattle";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { s1ForBattle, leaderBoardForBattle } = await loadFixture(
    deployS1ForBattle,
  );

  return {
    s1ForBattle,
    leaderBoardForBattle,
  };
}
