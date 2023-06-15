import {
  BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  BOSS_BATTLE_PROXY_ADDRESS,
} from "../const";
import { grantGameRoleToMnemonic } from "./utils/grantGameRoleToMnemonic";
import console from "console";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattle Post Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  const eventKey = "mch";
  const eventAddress = BOSS_BATTLE_MCH_1_PROXY_ADDRESS;

  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattleProxy = BossBattle.attach(addr);

  console.log("addEventKey -----------------------------");
  console.log(`Before: ${await bossBattleProxy.getEventKeys()}`);
  await (await bossBattleProxy.addEventKey(eventKey)).wait();
  console.log(`After : ${await bossBattleProxy.getEventKeys()}`);

  console.log("addBossBattleEvent -----------------------------");
  console.log(`Before: ${await bossBattleProxy.getBossBattleEvents()}`);
  await (
    await bossBattleProxy.addBossBattleEvent(eventKey, eventAddress)
  ).wait();
  console.log(`After : ${await bossBattleProxy.getBossBattleEvents()}`);

  console.log("grantGameRoleToMnemonic -----------------------------");
  await grantGameRoleToMnemonic();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattle Post Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
