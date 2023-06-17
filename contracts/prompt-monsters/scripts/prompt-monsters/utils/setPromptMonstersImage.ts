import {
  PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  console.log("setPromptMonstersImage: ", PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  console.log("Before: ", await promptMonsters.getPromptMonstersImage());
  await (
    await promptMonsters.setPromptMonstersImage(
      PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
    )
  ).wait();
  console.log("After : ", await promptMonsters.getPromptMonstersImage());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
