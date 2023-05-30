import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  // console.log("Battle Seasons Address", await battle.getBattleSeasonsAddress());

  const wallet = ethers.Wallet.createRandom();
  console.log("Wallet address   : ", wallet.address);
  console.log("Wallet privateKey: ", wallet.privateKey);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
