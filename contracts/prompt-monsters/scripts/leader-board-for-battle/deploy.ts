import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start LeaderBoardForBattle Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const LeaderBoardForBattle = await ethers.getContractFactory(
    "LeaderBoardForBattle",
  );
  const leaderBoardForBattleProxy = await upgrades.deployProxy(
    LeaderBoardForBattle,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await leaderBoardForBattleProxy.deployed();
  console.log(
    "Deployed LeaderBoardForBattleProxy address: ",
    leaderBoardForBattleProxy.address,
  );
  console.log(
    "LeaderBoardForBattle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      leaderBoardForBattleProxy.address,
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
  //     address: leaderBoardForBattleProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End LeaderBoardForBattle Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
