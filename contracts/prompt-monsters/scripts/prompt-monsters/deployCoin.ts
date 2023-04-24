import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Mock MCH Coin Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const MCHCoin = await ethers.getContractFactory("MCHCoin");
  const mchCoinProxy = await upgrades.deployProxy(MCHCoin, {
    kind: "uups",
    initializer: "initialize",
  });
  await mchCoinProxy.deployed();
  console.log("Deployed MCHCoinProxy address: ", mchCoinProxy.address);
  console.log(
    "MCHCoin implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(mchCoinProxy.address),
  );

  console.log("Completed deployment");

  // Wait 10 seconds before verification, because it fails if it is done immediately after deployment
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("---------------------------------------------");
  ("---------------------------------------------");
  console.log("--- End mchCoin Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
