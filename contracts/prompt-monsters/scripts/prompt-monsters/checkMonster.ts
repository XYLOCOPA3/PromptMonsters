import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const startBlockHeight = 21342235;
  const endBlockHeight = 22542235;
  // const startBlockHeight = 22510878;
  // const startBlockHeight = 21642235;
  // const startBlockHeight = 21342235;

  const createLogsTmp = await promptMonsters.queryFilter(
    promptMonsters.filters.MintedMonster(null, null, null),
    startBlockHeight,
    startBlockHeight + 1200000,
  );

  if (createLogsTmp.length === 0) return;

  for (let i = 0; i < createLogsTmp.length; i++) {
    console.log(createLogsTmp[i].args.newTokenId.toString());
    console.log(createLogsTmp[i].args.tokenOwner);
    const t = await createLogsTmp[i].getBlock();
    // console.log(
    //   new Date(t.timestamp * 1000).toLocaleString("ja-JP", {
    //     timeZone: "Asia/Tokyo",
    //   }),
    // );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
