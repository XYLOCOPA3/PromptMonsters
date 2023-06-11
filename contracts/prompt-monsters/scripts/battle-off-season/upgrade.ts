import { BATTLE_OFF_SEASON_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleOffSeason Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log(
    "Upgrade BattleOffSeasonProxy address: ",
    BATTLE_OFF_SEASON_PROXY_ADDRESS,
  );

  const BattleOffSeason = await ethers.getContractFactory("TestBOS");
  const battleOffSeasonProxy = await upgrades.upgradeProxy(
    BATTLE_OFF_SEASON_PROXY_ADDRESS,
    BattleOffSeason,
  );
  await battleOffSeasonProxy.deployed();
  console.log(
    "Upgraded BattleOffSeason implementation:",
    await upgrades.erc1967.getImplementationAddress(
      BATTLE_OFF_SEASON_PROXY_ADDRESS,
    ),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleOffSeason Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
