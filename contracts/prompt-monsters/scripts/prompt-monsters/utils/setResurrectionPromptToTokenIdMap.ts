import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function main() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log("- setResurrectionPromptToTokenIdMap");

  // トークンIDリストを生成
  const totalSupply = Number(await promptMonsters.getMonstersTotalSupply());
  console.log("totalSupply: ", totalSupply.toString());
  let tokenIds: number[] = [];
  for (let i = 0; i < totalSupply; i++) {
    tokenIds.push(i);
  }

  // トークンIDリストからRPを取得
  const resurrectionPrompts = await promptMonsters.getResurrectionPrompts(
    tokenIds,
  );
  for (let i = 0; i < resurrectionPrompts.length; i++) {
    console.log(`${tokenIds[i]}: ${resurrectionPrompts[i]}`);
  }

  // // トークンID -> RP のマップをセット
  // for (let i = 0; i < resurrectionPrompts.length; i++) {
  //   console.log(`${tokenIds[i]}: ${resurrectionPrompts[i]}`);
  //   await (
  //     await promptMonsters.setResurrectionPromptToTokenIdMap(
  //       tokenIds[i],
  //       resurrectionPrompts[i],
  //     )
  //   ).wait();
  // }
  // console.log("DONE!!!");
  // console.log("");

  // RPリストからトークンIDリストを取得
  const newTokenIds = await promptMonsters.getTokenIds(resurrectionPrompts);
  for (let i = 0; i < newTokenIds.length; i++) {
    console.log(`${newTokenIds[i]}: ${resurrectionPrompts[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
