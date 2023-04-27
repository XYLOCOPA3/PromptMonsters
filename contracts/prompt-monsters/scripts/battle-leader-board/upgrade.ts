import { BATTLE_LEADER_BOARD_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleLeaderBoard Upgrade ---------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log(
    "Upgrade BattleLeaderBoardProxy address: ",
    BATTLE_LEADER_BOARD_PROXY_ADDRESS,
  );

  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );
  const battleLeaderBoardProxy = await upgrades.upgradeProxy(
    BATTLE_LEADER_BOARD_PROXY_ADDRESS,
    BattleLeaderBoard,
  );
  await battleLeaderBoardProxy.deployed();
  console.log(
    "Upgraded BattleLeaderBoard implementation:",
    await upgrades.erc1967.getImplementationAddress(
      BATTLE_LEADER_BOARD_PROXY_ADDRESS,
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
  //     address: BATTLE_LEADER_BOARD_PROXY_ADDRESS,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleLeaderBoard Upgrade -----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
