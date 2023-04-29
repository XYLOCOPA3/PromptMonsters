import {
  BATTLE_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleS1 Post Deploy --------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battleS1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);

  console.log("Set PromptMonsters address");
  await (
    await battleS1.setPromptMonstersAddress(PROMPT_MONSTERS_PROXY_ADDRESS)
  ).wait();

  console.log("Set GAME_ROLE");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  await (await battleS1.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleS1 Post Deploy ----------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
