import { PROMPT_MONSTERS_ITEM_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const to = "0xda8310818eaa6dcad0dec433d4A48Cc2586044A2";
  const itemId = 1;
  // 適宜変更 ------------------------------

  const addr = PROMPT_MONSTERS_ITEM_PROXY_ADDRESS;
  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(addr);

  console.log("mintOnlyGameRole --------------------");
  console.log(`Before: ${Number(await promptMonstersItem.balanceOf(to))}`);
  await (await promptMonstersItem.mintOnlyGameRole(to, itemId)).wait();
  console.log(`After : ${Number(await promptMonstersItem.balanceOf(to))}`);
  console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
