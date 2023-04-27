import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleLeaderBoard Deploy ----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );
  const battleLeaderBoardProxy = await upgrades.deployProxy(
    BattleLeaderBoard,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleLeaderBoardProxy.deployed();
  console.log(
    "Deployed BattleLeaderBoardProxy address: ",
    battleLeaderBoardProxy.address,
  );
  console.log(
    "BattleLeaderBoard implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      battleLeaderBoardProxy.address,
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
  //     address: battleLeaderBoardProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleLeaderBoard Deploy ------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
