import {
  BATTLE_OFF_SEASON_PROXY_ADDRESS,
  BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleOffSeason Post Deploy -------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeason = BattleOffSeason.attach(
    BATTLE_OFF_SEASON_PROXY_ADDRESS,
  );

  console.log("Set PromptMonsters address");
  await (
    await battleOffSeason.setPromptMonstersAddress(
      PROMPT_MONSTERS_PROXY_ADDRESS,
    )
  ).wait();

  console.log("Set GAME_ROLE");
  const role = ethers.utils.id("GAME_ROLE");
  console.log("Before: ");
  const oldRoleMemberCount = await battleOffSeason.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await battleOffSeason.getRoleMember(role, i));
  }
  await (await battleOffSeason.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();
  console.log("After : ");
  const newRoleMemberCount = await battleOffSeason.getRoleMemberCount(role);
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await battleOffSeason.getRoleMember(role, i));
  }

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleOffSeason Post Deploy ---------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
