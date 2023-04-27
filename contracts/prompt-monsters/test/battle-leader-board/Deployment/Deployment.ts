import { deployBattleLeaderBoard } from "./BattleLeaderBoard";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { battleLeaderBoard, s1forBattle } = await loadFixture(
    deployBattleLeaderBoard,
  );

  return {
    battleLeaderBoard,
    s1forBattle,
  };
}
