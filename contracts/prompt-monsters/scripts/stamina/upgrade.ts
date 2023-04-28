import { STAMINA_PROXY_ADDRESS } from "../const";
import { ethers, upgrades, run } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Stamina Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade StaminaProxy address: ", STAMINA_PROXY_ADDRESS);

  const Stamina = await ethers.getContractFactory("Stamina");
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

  // Wait 10 seconds before verification, because it fails if it is done immediately after verification
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  try {
    await run("verify:verify", {
      address: STAMINA_PROXY_ADDRESS,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Stamina Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
