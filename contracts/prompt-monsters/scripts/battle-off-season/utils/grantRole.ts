import {
  BATTLE_OFF_SEASON_PROXY_ADDRESS,
  BATTLE_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // const Battle = await ethers.getContractFactory("TestB");

  // const battleOffSeason = Battle.attach(BATTLE_OFF_SEASON_PROXY_ADDRESS);

  // console.log(`Address: ${BATTLE_PROXY_ADDRESS}`);

  // console.log("Before: ");
  // const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  // const oldRoleMemberCount = await battleOffSeason.getRoleMemberCount(role);
  // for (let i = 0; i < Number(oldRoleMemberCount); i++) {
  //   console.log(await battleOffSeason.getRoleMember(role, i));
  // }
  // await (await battleOffSeason.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();
  // console.log("After : ");
  // const newRoleMemberCount = await battleOffSeason.getRoleMemberCount(role);
  // for (let i = 0; i < Number(newRoleMemberCount); i++) {
  //   console.log(await battleOffSeason.getRoleMember(role, i));
  // }

  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));

  console.log("TestB");
  const Battle = await ethers.getContractFactory("TestB");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);
  for (let i = 0; i < Number(await battle.getRoleMemberCount(role)); i++) {
    console.log(await battle.getRoleMember(role, i));
  }

  console.log("TestBOS");
  const BattleOffSeason = await ethers.getContractFactory("TestBOS");
  const battleOffSeason = BattleOffSeason.attach(
    BATTLE_OFF_SEASON_PROXY_ADDRESS,
  );
  for (
    let i = 0;
    i < Number(await battleOffSeason.getRoleMemberCount(role));
    i++
  ) {
    console.log(await battleOffSeason.getRoleMember(role, i));
  }

  console.log("TestBS1");
  const BattleS1 = await ethers.getContractFactory("TestBS1");
  const battleS1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);
  for (let i = 0; i < Number(await battleS1.getRoleMemberCount(role)); i++) {
    console.log(await battleS1.getRoleMember(role, i));
  }

  console.log("TestPM");
  const PromptMonsters = await ethers.getContractFactory("TestPM");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  for (
    let i = 0;
    i < Number(await promptMonsters.getRoleMemberCount(role));
    i++
  ) {
    console.log(await promptMonsters.getRoleMember(role, i));
  }

  console.log("TestS");
  const Stamina = await ethers.getContractFactory("TestS");
  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);
  for (let i = 0; i < Number(await stamina.getRoleMemberCount(role)); i++) {
    console.log(await stamina.getRoleMember(role, i));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
