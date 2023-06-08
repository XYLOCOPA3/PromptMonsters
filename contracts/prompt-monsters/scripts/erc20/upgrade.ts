import { ERC20_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Erc20 Upgrade ---------------------");
  console.log("---------------------------------------------");
  console.log("");

  const addr = ERC20_ADDRESS;

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade Erc20Proxy address: ", addr);

  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20Proxy = await upgrades.upgradeProxy(addr, Erc20);
  await erc20Proxy.deployed();
  console.log(
    "Upgraded Erc20 implementation:",
    await upgrades.erc1967.getImplementationAddress(addr),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Erc20 Upgrade -----------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
