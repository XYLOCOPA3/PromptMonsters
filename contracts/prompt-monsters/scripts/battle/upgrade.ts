import { BATTLE_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Battle Upgrade --------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade BattleProxy address: ", BATTLE_PROXY_ADDRESS);

  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.upgradeProxy(BATTLE_PROXY_ADDRESS, Battle);
  await battleProxy.deployed();
  console.log(
    "Upgraded Battle implementation:",
    await upgrades.erc1967.getImplementationAddress(BATTLE_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Battle Upgrade ----------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
