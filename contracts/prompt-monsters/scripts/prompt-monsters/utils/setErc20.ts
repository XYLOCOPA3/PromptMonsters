import { ERC20_ADDRESS, PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function setErc20() {
  console.log("setErc20: ", ERC20_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  console.log("Before: ", await promptMonsters.getErc20());
  await (await promptMonsters.setErc20(ERC20_ADDRESS)).wait();
  console.log("After : ", await promptMonsters.getErc20());
}

setErc20().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
