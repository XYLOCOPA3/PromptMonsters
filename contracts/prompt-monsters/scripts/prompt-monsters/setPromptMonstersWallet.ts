import {
  PROMPT_MONSTERS_PROXY_ADDRESS,
  PROMPT_MONSTERS_WALLET,
} from "../const";
import { ethers } from "hardhat";

export async function main() {
  console.log("setPromptMonstersWallet: ", PROMPT_MONSTERS_WALLET);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  console.log("Before: ", await promptMonsters.promptMonstersWallet());
  await (
    await promptMonsters.setPromptMonstersWallet(PROMPT_MONSTERS_WALLET)
  ).wait();
  console.log("After : ", await promptMonsters.promptMonstersWallet());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
