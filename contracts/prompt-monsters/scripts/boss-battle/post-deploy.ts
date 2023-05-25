import {
  BOSS_BATTLE_MZ_DAO_PROXY_ADDRESS,
  BOSS_BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattle Post Deploy ----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(BOSS_BATTLE_PROXY_ADDRESS);

  console.log("Set PromptMonsters address");
  console.log(`PromptMonsters address: ${PROMPT_MONSTERS_PROXY_ADDRESS}`);
  console.log(`Before: ${await bossBattle.promptMonsters()}`);
  await (
    await bossBattle.setPromptMonstersAddress(PROMPT_MONSTERS_PROXY_ADDRESS)
  ).wait();
  console.log(`After : ${await bossBattle.promptMonsters()}`);

  console.log("Add BossBattleEvent address");
  await (
    await bossBattle.addBossBattleEventAddress(BOSS_BATTLE_MZ_DAO_PROXY_ADDRESS)
  ).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattle Post Deploy ------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
