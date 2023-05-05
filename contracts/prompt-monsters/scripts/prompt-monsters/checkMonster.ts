import {
  BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");
  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const Battle = await ethers.getContractFactory("Battle");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);
  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battles1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);

  const startBlockHeight = 21342240;

  const createLogsTmp = await promptMonsters.queryFilter(
    promptMonsters.filters.MintedMonster(null, null, null),
    startBlockHeight,
    startBlockHeight + 100000,
  );

  if (createLogsTmp.length === 0) return;

  for (let i = 0; i < createLogsTmp.length; i++) {
    console.log(createLogsTmp[i].args.newTokenId.toString());
    const t = await createLogsTmp[i].getBlock();
    console.log(
      new Date(t.timestamp * 1000).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      }),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
