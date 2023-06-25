import { BOSS_BATTLE_PROXY_ADDRESS, BOSS_MINT_PRICE } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const value = BOSS_MINT_PRICE;
  // 適宜変更 ------------------------------

  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(addr);

  console.log("setMintPrice -----------------------------");
  console.log(`Before: ${await bossBattle.getMintPrice()}`);
  await (await bossBattle.setMintPrice(value)).wait();
  console.log(`After:  ${await bossBattle.getMintPrice()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
