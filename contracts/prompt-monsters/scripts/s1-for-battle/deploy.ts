import { LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start S1ForBattle Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const S1ForBattle = await ethers.getContractFactory("S1ForBattle");
  const s1ForBattleProxy = await upgrades.deployProxy(
    S1ForBattle,
    [LEADER_BOARD_FOR_BATTLE_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await s1ForBattleProxy.deployed();
  console.log("Deployed S1ForBattleProxy address: ", s1ForBattleProxy.address);
  console.log(
    "S1ForBattle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(s1ForBattleProxy.address),
  );

  console.log("Completed deployment");

  // Wait 10 seconds before verification, because it fails if it is done immediately after deployment
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // console.log("--- Verify ----------------------------------");

  // console.log("Verifying...");

  // try {
  //   await run("verify:verify", {
  //     address: s1ForBattleProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End S1ForBattle Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
