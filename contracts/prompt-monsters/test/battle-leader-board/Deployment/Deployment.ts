import { deployBattleLeaderBoard } from "./BattleLeaderBoard";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { battleLeaderBoard, battleS1 } = await loadFixture(
    deployBattleLeaderBoard,
  );

  return {
    battleLeaderBoard,
    battleS1,
  };
}
