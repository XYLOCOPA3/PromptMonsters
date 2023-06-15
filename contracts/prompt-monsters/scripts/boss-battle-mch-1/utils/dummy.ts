import { BOSS_BATTLE_MCH_1_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function dummy() {
  const addr = BOSS_BATTLE_MCH_1_PROXY_ADDRESS;
  const BossBattleMch1 = await ethers.getContractFactory("BossBattleMch1");
  const bossBattleMch1Proxy = BossBattleMch1.attach(addr);
}

dummy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
