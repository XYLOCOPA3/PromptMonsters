import { PROMPT_MONSTERS_ITEM_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const itemId = 1;
  // 適宜変更 ------------------------------

  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(
    PROMPT_MONSTERS_ITEM_PROXY_ADDRESS,
  );

  console.log("item: ", await promptMonstersItem.getItem(itemId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
