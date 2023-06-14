import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

// TODO: 後で消す
export async function setGameRole() {
  const Battle = await ethers.getContractFactory("Battle");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  (await battle.setGameRole()).wait();
}

setGameRole().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
