import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function main() {
  console.log("- getMonsterIdToResurrectionPrompt");
  const monsterId = 25;

  const PromptMonsters = await ethers.getContractFactory("TestPM");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  console.log(await promptMonsters.getResurrectionPrompts([21]));
  console.log(await promptMonsters.getResurrectionPrompts([22]));
  console.log(await promptMonsters.getResurrectionPrompts([23]));
  console.log(await promptMonsters.getResurrectionPrompts([24]));
  console.log(await promptMonsters.getResurrectionPrompts([25]));
  console.log(await promptMonsters.getResurrectionPrompts([26]));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
