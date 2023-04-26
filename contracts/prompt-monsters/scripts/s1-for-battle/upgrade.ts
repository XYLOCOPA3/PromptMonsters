import { S1_FOR_BATTLE_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start S1ForBattle Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log(
    "Upgrade S1ForBattleProxy address: ",
    S1_FOR_BATTLE_PROXY_ADDRESS,
  );

  const S1ForBattle = await ethers.getContractFactory("S1ForBattle");
  const s1ForBattleProxy = await upgrades.upgradeProxy(
    S1_FOR_BATTLE_PROXY_ADDRESS,
    S1ForBattle,
  );
  await s1ForBattleProxy.deployed();
  console.log(
    "Upgraded S1ForBattle implementation:",
    await upgrades.erc1967.getImplementationAddress(
      S1_FOR_BATTLE_PROXY_ADDRESS,
    ),
  );

  console.log("Completed upgrade");

  // // Wait 10 seconds before verification, because it fails if it is done immediately after verification
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // console.log("--- Verify ----------------------------------");

  // console.log("Verifying...");

  // try {
  //   await run("verify:verify", {
  //     address: S1_FOR_BATTLE_PROXY_ADDRESS,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End S1ForBattle Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
