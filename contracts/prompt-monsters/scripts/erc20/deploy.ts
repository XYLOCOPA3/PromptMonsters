import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Erc20 Deploy ----------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20Proxy = await upgrades.deployProxy(Erc20, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await erc20Proxy.deployed();

  const erc20ImplementationAddress = await upgrades.erc1967.getImplementationAddress(erc20Proxy.address);
  
  try {
    recordContractsData("Erc20Proxy", erc20Proxy.address, deployer.address);
    recordContractsData("Erc20Implementation", erc20ImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log("Deployed Erc20 address: ", erc20Proxy.address);
  console.log(
    "Erc20 implementation deployed to:",
    erc20ImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("---------------------------------------------");
  console.log("--- End Erc20 Deploy ------------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
