import { PROMPT_MONSTERS_ITEM_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const tokenId = 0;
  // 適宜変更 ------------------------------

  const addr = PROMPT_MONSTERS_ITEM_PROXY_ADDRESS;
  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(addr);

  console.log("uri --------------------");
  console.log(`${await promptMonstersItem.tokenURI(tokenId)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
