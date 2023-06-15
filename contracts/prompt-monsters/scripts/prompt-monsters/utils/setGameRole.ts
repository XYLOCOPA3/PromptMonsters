import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

// TODO: 後で消す
export async function setGameRole() {
  const addr = PROMPT_MONSTERS_PROXY_ADDRESS;
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(addr);

  (await promptMonsters.setGameRole()).wait();
}

setGameRole().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
