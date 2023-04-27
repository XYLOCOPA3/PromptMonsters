import { BATTLE_LEADER_BOARD_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function addBattleSeasonAddress() {
  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );

  const battleLeaderBoard = BattleLeaderBoard.attach(
    BATTLE_LEADER_BOARD_PROXY_ADDRESS,
  );

  const address: string = "0x250548D3B864d705Dd2D5a3f92D1B962145335cf";

  console.log("address: ", address);

  await (await battleLeaderBoard.addBattleSeasonAddress(address)).wait();
}

addBattleSeasonAddress().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
