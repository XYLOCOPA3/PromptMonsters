import {
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

async function setGameRole() {
  console.log("setGameRole -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "TestBMMY",
  );
  const bossMonsterMchYoshkaProxy = BossMonsterMchYoshka.attach(
    BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  );

  console.log("Set GAME_ROLE -----------------------------");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  await (
    await bossMonsterMchYoshkaProxy.grantRole(role, BOSS_BATTLE_PROXY_ADDRESS)
  ).wait();
}

setGameRole().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
