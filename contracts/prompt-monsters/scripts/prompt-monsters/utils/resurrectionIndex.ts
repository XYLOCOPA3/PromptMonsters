import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function get() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");

  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const resurrectionPrompt = "0xA700cEeB30f0d96D8dD51f7a2021874f672C9D07";

  console.log("resurrection prompt: ", resurrectionPrompt);
  console.log(
    "monster histroy of the resurrection prompt: ",
    await promptMonsters.getMonsterHistory(resurrectionPrompt),
  );
  console.log(
    "monster ID of the resurrection prompt: ",
    await promptMonsters.resurrectionIndex(resurrectionPrompt),
  );
  const monstersTotalSupply = await promptMonsters.getMonstersTotalSupply();
  console.log("monsters total supply", monstersTotalSupply);
  const monstersTokenIds = [...Array(monstersTotalSupply.toNumber())].map(
    (_, i) => i,
  );
  console.log(
    "all monsters: ",
    await promptMonsters.getMonsters(monstersTokenIds),
  );
}

get().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
