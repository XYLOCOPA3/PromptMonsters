import {
  DISTRIBUTOR_WALLET,
  PROMPT_MONSTERS_ITEM_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const role = ethers.utils.id("GAME_ROLE");
  const addr = DISTRIBUTOR_WALLET;
  // 適宜変更 ------------------------------

  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(
    PROMPT_MONSTERS_ITEM_PROXY_ADDRESS,
  );

  console.log("Before: ", await promptMonstersItem.hasRole(role, addr));
  await (await promptMonstersItem.grantRole(role, addr)).wait();
  console.log("After : ", await promptMonstersItem.hasRole(role, addr));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
