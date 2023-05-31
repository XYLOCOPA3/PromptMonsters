import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Erc20 Coin Deploy -----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = await Erc20.deploy();
  await erc20.deployed();
  console.log("Deployed Erc20 address: ", erc20.address);

  console.log("Completed deployment");

  console.log("---------------------------------------------");
  console.log("--- End Erc20 Deploy ------------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
