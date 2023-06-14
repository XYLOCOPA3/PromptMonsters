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
  const bossBattleAddress = BOSS_BATTLE_PROXY_ADDRESS;

  const addr = BOSS_BATTLE_MCH_1_PROXY_ADDRESS;
  const BossBattleMch1 = await ethers.getContractFactory("BossBattleMch1");
  const bossBattleMch1Proxy = BossBattleMch1.attach(addr);

  console.log("setBossMonster -----------------------------");
  console.log(`Before: ${await bossBattleMch1Proxy.getBossMonster()}`);
  await (await bossBattleMch1Proxy.setBossMonster(bossMonsterAddress)).wait();
  console.log(`After : ${await bossBattleMch1Proxy.getBossMonster()}`);

  console.log("grantRole -----------------------------");
  const role = ethers.utils.id("GAME_ROLE");
  console.log("Before: ");
  const oldRoleMemberCount = await bossBattleMch1Proxy.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await bossBattleMch1Proxy.getRoleMember(role, i));
  }
  await (await bossBattleMch1Proxy.grantRole(role, bossBattleAddress)).wait();
  console.log("After : ");
  const newRoleMemberCount = await bossBattleMch1Proxy.getRoleMemberCount(role);
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await bossBattleMch1Proxy.getRoleMember(role, i));
  }

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattleMch1 Post Deploy ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
