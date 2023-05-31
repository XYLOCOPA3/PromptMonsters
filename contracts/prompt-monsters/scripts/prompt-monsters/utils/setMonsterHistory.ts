import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function main() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log("- setMonsterHistory");
  // const monsterId = 21;
  // const monsterId = 22;
  // const monsterId = 23;
  // const monsterId = 24;
  const monsterId = 25;
  const resurrectionPrompt = await promptMonsters.monsterIdToResurrectionPrompt(
    monsterId,
  );

  const before = await promptMonsters.getMonsterHistory(resurrectionPrompt);
  console.log("Before: ", before);
  if (before.name !== "") {
    console.log(
      "モンスターが既にセットされています。上書きしたい場合はこちらのif分をコメントアウトしてください",
    );
    return;
  }
  await (
    await promptMonsters.setMonsterHistory(monsterId, resurrectionPrompt)
  ).wait();
  console.log(
    "After : ",
    await promptMonsters.getMonsterHistory(resurrectionPrompt),
  );
  console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
