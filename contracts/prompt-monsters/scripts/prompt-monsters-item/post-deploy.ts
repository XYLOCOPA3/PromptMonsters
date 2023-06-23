import {
  PROMPT_MONSTERS_ITEM_EXTERNAL_LINK,
  PROMPT_MONSTERS_ITEM_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  const addr = PROMPT_MONSTERS_ITEM_PROXY_ADDRESS;

  console.log("---------------------------------------------");
  console.log("--- Start PromptMonstersItem Post Deploy ---");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(addr);

  console.log("setExternalLink -------------");
  console.log(`Before: ${await promptMonstersItem.getExternalLink()}`);
  await (
    await promptMonstersItem.setExternalLink(PROMPT_MONSTERS_ITEM_EXTERNAL_LINK)
  ).wait();
  console.log(`After : ${await promptMonstersItem.getExternalLink()}`);
  console.log("DONE!!!");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonstersItem Post Deploy -----");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
