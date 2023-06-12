import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PromptMonstersImage Deploy --------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonstersImage = await ethers.getContractFactory(
    "TestPMI",
  );
  const promptMonstersImageProxy = await upgrades.deployProxy(
    PromptMonstersImage,
    [PROMPT_MONSTERS_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersImageProxy.deployed();

  const promptMonstersImageImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    promptMonstersImageProxy.address,
  );
  
  try {
    recordContractsData("PromptMonstersImageProxy", promptMonstersImageProxy.address, deployer.address);
    recordContractsData("PromptMonstersImageImplementation", promptMonstersImageImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log(
    "Deployed PromptMonstersImageProxy address: ",
    promptMonstersImageProxy.address,
  );
  console.log(
    "PromptMonstersImage implementation deployed to:",
    promptMonstersImageImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonstersImage Deploy ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
