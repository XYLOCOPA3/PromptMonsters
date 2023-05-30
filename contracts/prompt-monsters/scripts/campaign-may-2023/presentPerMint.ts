import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const totalSupply = await promptMonsters.getMonstersTotalSupply();
  console.log(`totalSupply: ${totalSupply}`);

  console.log("");
  console.log(
    "---------------------------------- owner address list for tokenID ----------------------------------",
  );

  for (var i = 0; i < totalSupply.toNumber(); i++) {
    console.log(promptMonsters.ownerOf(i) + ",");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
