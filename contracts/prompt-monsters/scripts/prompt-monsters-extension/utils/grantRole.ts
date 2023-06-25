import {
  PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const role = ethers.utils.id("GAME_ROLE");
  const addr = PROMPT_MONSTERS_PROXY_ADDRESS;
  // 適宜変更 ------------------------------

  const PromptMonstersExtension = await ethers.getContractFactory(
    "PromptMonstersExtension",
  );
  const promptMonstersExtension = PromptMonstersExtension.attach(
    PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  );

  console.log("Before: ", await promptMonstersExtension.hasRole(role, addr));
  await (await promptMonstersExtension.grantRole(role, addr)).wait();
  console.log("After : ", await promptMonstersExtension.hasRole(role, addr));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
