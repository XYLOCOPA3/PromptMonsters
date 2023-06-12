import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const monsterId = 259;

  const PromptMonsters = await ethers.getContractFactory("TestPM");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log(`${await promptMonsters.tokenURI(monsterId)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
