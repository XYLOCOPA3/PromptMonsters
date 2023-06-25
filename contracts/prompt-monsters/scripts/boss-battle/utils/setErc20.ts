import { BOSS_BATTLE_PROXY_ADDRESS, ERC20_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const value = ERC20_ADDRESS;
  // 適宜変更 ------------------------------

  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(addr);

  console.log("setErc20 -----------------------------");
  console.log(`Before: ${await bossBattle.getErc20()}`);
  await (await bossBattle.setErc20(value)).wait();
  console.log(`After:  ${await bossBattle.getErc20()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
