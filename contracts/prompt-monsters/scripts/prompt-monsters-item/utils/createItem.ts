import { IPromptMonstersItem } from "../../../typechain-types";
import { PROMPT_MONSTERS_ITEM_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const itemId = 1; // Mystery Chest
  // English
  const item: IPromptMonstersItem.ItemStruct = {
    name: "Mystery Chest",
    description:
      "Mystery Chest, a wondrous treasure chest brimming with unknown potential. Its glittering exterior bewitches many, beckoning forth miracles or misfortunes.",
    imageURL:
      "https://ipfs.io/ipfs/bafkreia3jhnzjbikj2ksm6teip6aqscg4ivq6qygbcqhi2hfletprrviem",
  };
  // 日本語
  // const item: IPromptMonstersItem.ItemStruct = {
  //   name: "ミステリーチェスト",
  //   description:
  //     "ミステリーチェストは未知の可能性が詰まった不思議な宝箱。キラキラと輝くその外観には数多の者が魅了され、奇跡か災厄を引き起こす。",
  //   imageURL:
  //     "https://ipfs.io/ipfs/bafkreia3jhnzjbikj2ksm6teip6aqscg4ivq6qygbcqhi2hfletprrviem",
  // };

  const addr = PROMPT_MONSTERS_ITEM_PROXY_ADDRESS;
  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(addr);

  console.log("createItem --------------------");
  console.log(`Before: ${Number(await promptMonstersItem.getItemIds())}`);
  await (await promptMonstersItem.createItem(itemId, item)).wait();
  const itemIds = Number(await promptMonstersItem.getItemIds());
  console.log(`After : ${itemIds}`);
  console.log(await promptMonstersItem.getItem(itemId));
  console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
