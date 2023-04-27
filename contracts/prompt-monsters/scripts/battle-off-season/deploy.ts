import { BATTLE_LEADER_BOARD_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleOffSeason Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeasonProxy = await upgrades.deployProxy(
    BattleOffSeason,
    [BATTLE_LEADER_BOARD_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleOffSeasonProxy.deployed();
  console.log(
    "Deployed BattleOffSeasonProxy address: ",
    battleOffSeasonProxy.address,
  );
  console.log(
    "BattleOffSeason implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      battleOffSeasonProxy.address,
    ),
  );

  console.log("Completed deployment");

  // Wait 10 seconds before verification, because it fails if it is done immediately after deployment
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // console.log("--- Verify ----------------------------------");

  // console.log("Verifying...");

  // try {
  //   await run("verify:verify", {
  //     address: battleOffSeasonProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleOffSeason Deploy --------------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- Start set to BattleLeaderBoard Deploy --------------");
  console.log("---------------------------------------------");

  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );

  const battleLeaderBoard = BattleLeaderBoard.attach(
    BATTLE_LEADER_BOARD_PROXY_ADDRESS,
  );

  await (
    await battleLeaderBoard.addBattleSeasonAddress(battleOffSeasonProxy.address)
  ).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End set to BattleLeaderBoard Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});