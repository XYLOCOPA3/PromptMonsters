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
  console.log("--- Start Stamina Post Deploy ---------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Stamina = await ethers.getContractFactory("Stamina");
  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  console.log("Set PromptMonsters address");
  await (
    await stamina.setPromptMonstersAddress(PROMPT_MONSTERS_PROXY_ADDRESS)
  ).wait();

  console.log("Set GAME_ROLE");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  await (await stamina.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();
  await (await stamina.grantRole(role, BATTLE_OFF_SEASON_PROXY_ADDRESS)).wait();
  await (await stamina.grantRole(role, BATTLE_S1_PROXY_ADDRESS)).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Stamina Post Deploy -----------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
