import { BOSS_BATTLE_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattle Upgrade ----------------");
  console.log("---------------------------------------------");
  console.log("");

  const addr = BOSS_BATTLE_PROXY_ADDRESS;

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade BossBattleProxy address: ", addr);

  const BossBattle = await ethers.getContractFactory("TestBB");
  const bossBattleProxy = await upgrades.upgradeProxy(addr, BossBattle);
  await bossBattleProxy.deployed();
  console.log(
    "Upgraded BossBattle implementation:",
    await upgrades.erc1967.getImplementationAddress(addr),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattle Upgrade ------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
