import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PromptMonstersExtension Deploy ----");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonstersExtension = await ethers.getContractFactory(
    "TestPME",
  );
  const promptMonstersExtensionProxy = await upgrades.deployProxy(
    PromptMonstersExtension,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersExtensionProxy.deployed();

  const promptMonstersExtensionImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    promptMonstersExtensionProxy.address,
  )
  
  try {
    recordContractsData("PromptMonstersExtensionProxy", promptMonstersExtensionProxy.address, deployer.address);
    recordContractsData("PromptMonstersExtensionImplementation", promptMonstersExtensionImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log(
    "Deployed PromptMonstersExtensionProxy address: ",
    promptMonstersExtensionProxy.address,
  );
  console.log(
    "PromptMonstersExtension implementation deployed to:",
    promptMonstersExtensionImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonstersExtension Deploy ------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
