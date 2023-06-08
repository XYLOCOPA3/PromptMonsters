import { BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function dummy() {
  console.log("dummy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshkaProxy = BossMonsterMchYoshka.attach(
    BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  );
}

dummy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
