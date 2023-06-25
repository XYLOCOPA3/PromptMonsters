import {
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MONSTER_MCH_YOSHKA_WALLET,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const eventKey = "mch";
  const value = BOSS_MONSTER_MCH_YOSHKA_WALLET;
  // 適宜変更 ------------------------------

  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(addr);

  console.log("addBossMonsterWallet -----------------------------");
  console.log(`Before: ${await bossBattle.getBossMonsterWallets(eventKey)}`);
  await (await bossBattle.addBossMonsterWallet(eventKey, value)).wait();
  console.log(`After:  ${await bossBattle.getBossMonsterWallets(eventKey)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
