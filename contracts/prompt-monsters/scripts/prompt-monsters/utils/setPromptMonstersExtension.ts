import {
  PROMPT_MONSTERS_PROXY_ADDRESS,
  PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

async function main() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log("- Set PromptMonstersExtension address");
  console.log("Before: ", await promptMonsters.getPromptMonstersExtension());
  await (
    await promptMonsters.setPromptMonstersExtension(
      PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
    )
  ).wait();
  console.log("After : ", await promptMonsters.getPromptMonstersExtension());
  console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
