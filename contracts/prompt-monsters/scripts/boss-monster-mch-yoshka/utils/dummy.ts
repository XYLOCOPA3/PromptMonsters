import { BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function dummy() {
  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;
  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(addr);
}

dummy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
