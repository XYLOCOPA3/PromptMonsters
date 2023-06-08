import { BOSS_BATTLE_MCH_1_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattleMch1 Upgrade ------------");
  console.log("---------------------------------------------");
  console.log("");

  const addr = BOSS_BATTLE_MCH_1_PROXY_ADDRESS;

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade BossBattleMch1Proxy address: ", addr);

  const BossBattleMch1 = await ethers.getContractFactory("BossBattleMch1");
  const bossBattleMch1Proxy = await upgrades.upgradeProxy(addr, BossBattleMch1);
  await bossBattleMch1Proxy.deployed();
  console.log(
    "Upgraded BossBattleMch1 implementation:",
    await upgrades.erc1967.getImplementationAddress(addr),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattleMch1 Upgrade --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
