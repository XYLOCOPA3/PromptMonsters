import { PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS } from "../const";
import { grantGameRoleToMnemonic } from "./utils/grantGameRoleToMnemonic";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("- Start PromptMonstersExtension Post Deploy -");
  console.log("---------------------------------------------");
  console.log("");

  const addr = PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS;
  const PromptMonstersExtension = await ethers.getContractFactory(
    "PromptMonstersExtension",
  );
  const promptMonstersExtension = PromptMonstersExtension.attach(addr);

  console.log("grantGameRoleToMnemonic -----------------------------");
  await grantGameRoleToMnemonic();

  console.log("");
  console.log("---------------------------------------------");
  console.log("- End PromptMonstersExtension Post Deploy ---");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
