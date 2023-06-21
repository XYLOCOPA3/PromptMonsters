import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Distributor Deploy ----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributorProxy = await upgrades.deployProxy(Distributor, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await distributorProxy.deployed();
  console.log("Deployed DistributorProxy address: ", distributorProxy.address);
  console.log(
    "Distributor implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(distributorProxy.address),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Distributor Deploy ------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
