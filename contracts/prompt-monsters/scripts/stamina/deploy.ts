import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Stamina Deploy --------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Stamina = await ethers.getContractFactory("TestS");
  const staminaProxy = await upgrades.deployProxy(
    Stamina,
    [PROMPT_MONSTERS_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await staminaProxy.deployed();

  const staminaImplementationAddress = await upgrades.erc1967.getImplementationAddress(staminaProxy.address);
  
  try {
    recordContractsData("StaminaProxy", staminaProxy.address, deployer.address);
    recordContractsData("StaminaImplementation", staminaImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log("Deployed StaminaProxy address: ", staminaProxy.address);
  console.log(
    "Stamina implementation deployed to:",
    staminaImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Stamina Deploy ----------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
