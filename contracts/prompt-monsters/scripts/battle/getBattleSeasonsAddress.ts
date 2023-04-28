import { BATTLE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function getBattleSeasonsAddress() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  console.log("Battle Seasons Address", await battle.getBattleSeasonsAddress());
}

getBattleSeasonsAddress().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
