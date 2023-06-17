import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function main() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log("- setMonsterHistory");
  const totalSupply = Number(await promptMonsters.getMonstersTotalSupply());
  console.log("totalSupply: ", totalSupply.toString());
  let tokenIds: number[] = [];
  for (let i = 0; i < totalSupply; i++) {
    tokenIds.push(i);
  }

  // for (let i = 0; i < totalSupply; i++) {
  //   // _monsterHistoryMapへ登録
  //   await promptMonsters.getMonsters();

  //   // _tokenIdToResurrectionPromptMapへ登録
  //   // _mintedMapへ登録
  // }

  // const monsterId = 21;
  // const monsterId = 22;
  // const monsterId = 23;
  // const monsterId = 24;
  // const monsterId = 25;
  // const resurrectionPrompts = await promptMonsters.getResurrectionPrompts([
  //   monsterId,
  // ]);

  // const results = await Promise.all([
  //   promptMonsters.getMonsterExtensions(resurrectionPrompts),
  //   promptMonsters.getMonsters([monsterId]),
  // ]);
  // const before = results[0][0];
  // console.log("Before: ", before);
  // if (before.name !== "") {
  //   console.log(
  //     "モンスターが既にセットされています。上書きしたい場合はこちらのif分をコメントアウトしてください",
  //   );
  //   return;
  // }
  // const monster = results[1][0];
  // await (
  //   await promptMonsters.setMonsterHistory(resurrectionPrompts[0], monster)
  // ).wait();
  // console.log(
  //   "After : ",
  //   (await promptMonsters.getMonsterExtensions(resurrectionPrompts))[0],
  // );
  // console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
