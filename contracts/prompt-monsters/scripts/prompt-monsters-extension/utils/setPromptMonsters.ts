import {
  PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

async function main() {
  const addr = PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS;
  const PromptMonstersExtension = await ethers.getContractFactory(
    "PromptMonstersExtension",
  );
  const promptMonstersExtension = PromptMonstersExtension.attach(addr);
  console.log("- Set PromptMonstersExtension address");
  await (
    await promptMonstersExtension.setPromptMonsters(
      PROMPT_MONSTERS_PROXY_ADDRESS,
    )
  ).wait();
  console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
