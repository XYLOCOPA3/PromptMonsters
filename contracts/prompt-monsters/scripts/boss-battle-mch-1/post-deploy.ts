import {
  BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattleMch1 Post Deploy --------");
  console.log("---------------------------------------------");
  console.log("");

  const bossMonsterAddress = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattleMch1 = await ethers.getContractFactory("TestBBM1");
  const bossBattleMch1Proxy = BossBattleMch1.attach(
    BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  );

  console.log("setBossMonster -----------------------------");
  console.log(`Before: ${await bossBattleMch1Proxy.getBossMonster()}`);
  await (await bossBattleMch1Proxy.setBossMonster(bossMonsterAddress)).wait();
  console.log(`After : ${await bossBattleMch1Proxy.getBossMonster()}`);

  console.log("Set GAME_ROLE -----------------------------");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  await (
    await bossBattleMch1Proxy.grantRole(role, BOSS_BATTLE_PROXY_ADDRESS)
  ).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattleMch1 Post Deploy ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
