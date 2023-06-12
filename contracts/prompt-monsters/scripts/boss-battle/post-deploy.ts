import {
  BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  BOSS_BATTLE_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattle Post Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  const eventKey = "mch";
  const eventAddress = BOSS_BATTLE_MCH_1_PROXY_ADDRESS;

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattle = await ethers.getContractFactory("TestBB");
  const bossBattleProxy = BossBattle.attach(BOSS_BATTLE_PROXY_ADDRESS);

  console.log("Add event key -----------------------------");
  console.log(`Before: ${await bossBattleProxy.getEventKeys()}`);
  await (await bossBattleProxy.addEventKey(eventKey)).wait();
  console.log(`After : ${await bossBattleProxy.getEventKeys()}`);

  console.log("Add event address -----------------------------");
  console.log(`Before: ${await bossBattleProxy.getBossBattleEvents()}`);
  await (
    await bossBattleProxy.addBossBattleEvent(eventKey, eventAddress)
  ).wait();
  console.log(`After : ${await bossBattleProxy.getBossBattleEvents()}`);

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattle Post Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
