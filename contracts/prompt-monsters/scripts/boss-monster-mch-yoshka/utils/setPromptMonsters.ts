import {
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const value = PROMPT_MONSTERS_PROXY_ADDRESS;
  // 適宜変更 ------------------------------

  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;
  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(addr);

  console.log("setPromptMonsters -----------------------------");
  console.log(`Before: ${await bossMonsterMchYoshka.getPromptMonsters()}`);
  await (await bossMonsterMchYoshka.setPromptMonsters(value)).wait();
  console.log(`After:  ${await bossMonsterMchYoshka.getPromptMonsters()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
