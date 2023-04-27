import { BATTLE_LEADER_BOARD_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function getBattleSeasonData() {
  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );

  const battleLeaderBoard = BattleLeaderBoard.attach(
    BATTLE_LEADER_BOARD_PROXY_ADDRESS,
  );

  const monsterId = 10;
  console.log("getBattleSeasonData ------------------");
  console.log(await battleLeaderBoard.getBattleSeasonData(0, monsterId));
  console.log("getSeasonWinCount ------------------");
  console.log(await battleLeaderBoard.getSeasonWinCount(0, monsterId));
  console.log("getSeasonMatchCount ------------------");
  console.log(await battleLeaderBoard.getSeasonMatchCount(0, monsterId));
}

getBattleSeasonData().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
