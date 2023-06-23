import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PromptMonstersItem Deploy ---------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = await upgrades.deployProxy(
    PromptMonstersItem,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersItem.deployed();
  console.log(
    "Deployed PromptMonstersItemProxy address: ",
    promptMonstersItem.address,
  );
  console.log(
    "PromptMonstersItem implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(promptMonstersItem.address),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonstersItem Deploy -----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
