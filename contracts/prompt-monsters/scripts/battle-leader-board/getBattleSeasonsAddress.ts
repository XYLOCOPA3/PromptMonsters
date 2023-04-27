import { BATTLE_LEADER_BOARD_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function getBattleSeasonsAddress() {
  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );

  const battleLeaderBoard = BattleLeaderBoard.attach(
    BATTLE_LEADER_BOARD_PROXY_ADDRESS,
  );

  console.log(
    "Battle Seasons Address",
    await battleLeaderBoard.getBattleSeasonsAddress(),
  );
}

getBattleSeasonsAddress().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
