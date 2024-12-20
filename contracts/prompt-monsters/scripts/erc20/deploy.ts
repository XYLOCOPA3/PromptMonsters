import { ethers, upgrades } from "hardhat";

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
  console.log("Deployed Erc20 address: ", erc20Proxy.address);
  console.log(
    "Erc20 implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(erc20Proxy.address),
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
