import { deployLeaderBoardForBattle } from "./LeaderBoardForBattle";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { leaderBoardForBattle, s1forBattle } = await loadFixture(
    deployLeaderBoardForBattle,
  );

  return {
    leaderBoardForBattle,
    s1forBattle,
  };
}
