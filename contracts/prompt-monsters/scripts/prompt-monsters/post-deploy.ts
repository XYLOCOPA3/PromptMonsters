import {
  PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PromptMonsters Post Deploy --------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log("Set PromptMonstersImage address -------------");
  await (
    await promptMonsters.setPromptMonstersImage(
      PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
    )
  ).wait();
  console.log("DONE!!!");

  console.log("Set PromptMonstersExtension address ---------");
  await (
    await promptMonsters.setPromptMonstersExtension(
      PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
    )
  ).wait();
  console.log("DONE!!!");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonsters Post Deploy ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
