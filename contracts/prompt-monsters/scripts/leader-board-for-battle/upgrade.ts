import { LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start LeaderBoardForBattle Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log(
    "Upgrade LeaderBoardForBattleProxy address: ",
    LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS,
  );

  const LeaderBoardForBattle = await ethers.getContractFactory(
    "LeaderBoardForBattle",
  );
  const leaderBoardForBattleProxy = await upgrades.upgradeProxy(
    LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS,
    LeaderBoardForBattle,
  );
  await leaderBoardForBattleProxy.deployed();
  console.log(
    "Upgraded LeaderBoardForBattle implementation:",
    await upgrades.erc1967.getImplementationAddress(
      LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS,
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
  //     address: LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End LeaderBoardForBattle Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
