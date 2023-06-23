import { PROMPT_MONSTERS_ITEM_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  const addr = PROMPT_MONSTERS_ITEM_PROXY_ADDRESS;

  console.log("---------------------------------------------");
  console.log("--- Start PromptMonstersItem Upgrade --------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade PromptMonstersItemProxy address: ", addr);

  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = await upgrades.upgradeProxy(
    addr,
    PromptMonstersItem,
  );
  await promptMonstersItem.deployed();
  console.log(
    "Upgraded PromptMonstersItem implementation:",
    await upgrades.erc1967.getImplementationAddress(addr),
  );

  console.log("Completed upgrade");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonstersItem Upgrade ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
