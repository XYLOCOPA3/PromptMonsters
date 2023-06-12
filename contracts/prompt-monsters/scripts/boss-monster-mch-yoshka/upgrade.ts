import { BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossMonsterMchYoshka Upgrade ------");
  console.log("---------------------------------------------");
  console.log("");

  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade BossMonsterMchYoshkaProxy address: ", addr);

  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "TestBMMY",
  );
  const bossMonsterMchYoshkaProxy = await upgrades.upgradeProxy(
    addr,
    BossMonsterMchYoshka,
  );
  await bossMonsterMchYoshkaProxy.deployed();
  console.log(
    "Upgraded BossMonsterMchYoshka implementation:",
    await upgrades.erc1967.getImplementationAddress(addr),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossMonsterMchYoshka Upgrade --------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
