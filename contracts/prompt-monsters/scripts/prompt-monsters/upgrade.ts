import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers, upgrades, run } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PromptMonsters Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log(
    "Upgrade PromptMonstersProxy address: ",
    PROMPT_MONSTERS_PROXY_ADDRESS,
  );

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonstersProxy = await upgrades.upgradeProxy(
    PROMPT_MONSTERS_PROXY_ADDRESS,
    PromptMonsters,
  );
  await promptMonstersProxy.deployed();
  console.log(
    "Upgraded PromptMonsters implementation:",
    await upgrades.erc1967.getImplementationAddress(
      PROMPT_MONSTERS_PROXY_ADDRESS,
    ),
  );

  console.log("Completed upgrade");

  // Wait 10 seconds before verification, because it fails if it is done immediately after verification
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  try {
    await run("verify:verify", {
      address: PROMPT_MONSTERS_PROXY_ADDRESS,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonsters Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
