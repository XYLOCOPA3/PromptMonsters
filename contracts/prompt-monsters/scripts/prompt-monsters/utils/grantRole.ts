import {
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const role = ethers.utils.id("GAME_ROLE");
  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;
  // 適宜変更 ------------------------------

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log("Before: ", await promptMonsters.hasRole(role, addr));
  await (await promptMonsters.grantRole(role, addr)).wait();
  console.log("After : ", await promptMonsters.hasRole(role, addr));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
