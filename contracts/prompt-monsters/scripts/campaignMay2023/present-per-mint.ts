import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const totalSupply = promptMonsters.getMonstersTotalSupply();
  console.log(`totalSupply: ${totalSupply}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
