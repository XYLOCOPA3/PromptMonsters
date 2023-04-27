import { BATTLE_S1_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleS1 Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade BattleS1Proxy address: ", BATTLE_S1_PROXY_ADDRESS);

  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battleS1Proxy = await upgrades.upgradeProxy(
    BATTLE_S1_PROXY_ADDRESS,
    BattleS1,
  );
  await battleS1Proxy.deployed();
  console.log(
    "Upgraded BattleS1 implementation:",
    await upgrades.erc1967.getImplementationAddress(BATTLE_S1_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  // // Wait 10 seconds before verification, because it fails if it is done immediately after verification
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // console.log("--- Verify ----------------------------------");

  // console.log("Verifying...");

  // try {
  //   await run("verify:verify", {
  //     address: BATTLE_S1_PROXY_ADDRESS,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleS1 Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
