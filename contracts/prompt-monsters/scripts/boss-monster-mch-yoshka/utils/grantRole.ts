import {
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const role = ethers.utils.id("GAME_ROLE");
  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  // 適宜変更 ------------------------------

  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(
    BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  );

  console.log("Before: ", await bossMonsterMchYoshka.hasRole(role, addr));
  await (await bossMonsterMchYoshka.grantRole(role, addr)).wait();
  console.log("After : ", await bossMonsterMchYoshka.hasRole(role, addr));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
