import { DISTRIBUTOR_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Distributor Upgrade ---------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade DistributorProxy address: ", DISTRIBUTOR_PROXY_ADDRESS);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributorProxy = await upgrades.upgradeProxy(
    DISTRIBUTOR_PROXY_ADDRESS,
    Distributor,
  );
  await distributorProxy.deployed();
  console.log(
    "Upgraded Distributor implementation:",
    await upgrades.erc1967.getImplementationAddress(DISTRIBUTOR_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Distributor Upgrade -----------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
