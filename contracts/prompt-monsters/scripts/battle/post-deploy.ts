import {
  BATTLE_OFF_SEASON_PROXY_ADDRESS,
  BATTLE_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Battle Post Deploy ----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Battle = await ethers.getContractFactory("TestB");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  console.log("Set PromptMonsters address");
  console.log(`PromptMonsters address: ${PROMPT_MONSTERS_PROXY_ADDRESS}`);
  console.log(`Before: ${await battle.promptMonsters()}`);
  await (
    await battle.setPromptMonstersAddress(PROMPT_MONSTERS_PROXY_ADDRESS)
  ).wait();
  console.log(`After : ${await battle.promptMonsters()}`);

  console.log("Set Stamina address");
  console.log(`Stamina address: ${STAMINA_PROXY_ADDRESS}`);
  console.log(`Before: ${await battle.stamina()}`);
  await (await battle.setStaminaAddress(STAMINA_PROXY_ADDRESS)).wait();
  console.log(`After : ${await battle.stamina()}`);

  console.log("Add BattleSeason address");
  await (
    await battle.addBattleSeasonAddress(BATTLE_OFF_SEASON_PROXY_ADDRESS)
  ).wait();
  await (await battle.addBattleSeasonAddress(BATTLE_S1_PROXY_ADDRESS)).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Battle Post Deploy ------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
