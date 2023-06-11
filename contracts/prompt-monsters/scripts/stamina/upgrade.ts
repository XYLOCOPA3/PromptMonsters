import { STAMINA_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Stamina Upgrade -------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade StaminaProxy address: ", STAMINA_PROXY_ADDRESS);

  const Stamina = await ethers.getContractFactory("TestS");
  const staminaProxy = await upgrades.upgradeProxy(
    STAMINA_PROXY_ADDRESS,
    Stamina,
  );
  await staminaProxy.deployed();
  console.log(
    "Upgraded Stamina implementation:",
    await upgrades.erc1967.getImplementationAddress(STAMINA_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Stamina Upgrade ---------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
