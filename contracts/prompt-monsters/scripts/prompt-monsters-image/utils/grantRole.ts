import {
  PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const role = ethers.utils.id("GAME_ROLE");
  const addr = PROMPT_MONSTERS_PROXY_ADDRESS;
  // 適宜変更 ------------------------------

  const PromptMonstersImage = await ethers.getContractFactory(
    "PromptMonstersImage",
  );
  const promptMonstersImage = PromptMonstersImage.attach(
    PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  );

  console.log("Before: ", await promptMonstersImage.hasRole(role, addr));
  await (await promptMonstersImage.grantRole(role, addr)).wait();
  console.log("After : ", await promptMonstersImage.hasRole(role, addr));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
