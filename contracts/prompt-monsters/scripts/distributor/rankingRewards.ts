import {
  BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

export async function main() {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const From11To50: any[] = [];

  const From51To100: any[] = [];

  console.log(
    "---------------------------------- execute distribution for ranking rewards ----------------------------------",
  );

  // 1位なら1000 OAS
  const prize1 = await promptMonsters.distribute( , 1000);
  // 2位なら500 OAS
  const prize2 = await promptMonsters.distribute( , 500);
  // 3位なら500 OAS 本当は300 OASだけど2位と同じ勝率だから500 OASあげちゃう
  const prize3 = await promptMonsters.distribute( , 500);
  // 4~6位なら200 OAS
  const prize4 = await promptMonsters.distribute( , 200);
  const prize5 = await promptMonsters.distribute( , 200);
  const prize6 = await promptMonsters.distribute( , 200);
  // 7~10位なら100 OAS
  const prize7 = await promptMonsters.distribute( , 100);
  const prize8 = await promptMonsters.distribute( , 100);
  const prize9 = await promptMonsters.distribute( , 100);
  const prize10 = await promptMonsters.distribute( , 100);
  // 11~50位なら50 OAS
  for (var i = 0; i < From11To50.length; i++) {
    const prizeFrom11To50 = await promptMonsters.distribute( From11To50[i], 50);
  }
  // 51~100位なら10 OAS
  for (var i = 0; i < From11To50.length; i++) {
    const prizeFrom51To100 = await promptMonsters.distribute( From51To100[i], 10);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
