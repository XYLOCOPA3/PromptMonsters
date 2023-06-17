import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

// TODO: 後で消す
export async function setAdminRole() {
  const role = ethers.utils.id("DEFAULT_ADMIN_ROLE");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Battle = await ethers.getContractFactory("Battle");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);
  // const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  // const battleOffSeason = BattleOffSeason.attach(
  //   BATTLE_OFF_SEASON_PROXY_ADDRESS,
  // );
  // const BattleS1 = await ethers.getContractFactory("BattleS1");
  // const battleS1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);
  // const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  // const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  // const PromptMonstersImage = await ethers.getContractFactory(
  //   "PromptMonstersImage",
  // );
  // const promptMonstersImage = PromptMonstersImage.attach(
  //   PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  // );
  // const Stamina = await ethers.getContractFactory("Stamina");
  // const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  // await (await battle.grantRole(role, deployer.address)).wait();
  // await (await battleOffSeason.grantRole(role, deployer.address)).wait();
  // await (await battleS1.grantRole(role, deployer.address)).wait();
  // await (await promptMonsters.grantRole(role, deployer.address)).wait();
  // await (await promptMonstersImage.grantRole(role, deployer.address)).wait();
  // await (await stamina.grantRole(role, deployer.address)).wait();
  // console.log(`DONE!!!`);

  // console.log("Before: ");
  // const oldRoleMemberCount = await battle.getRoleMemberCount(role);
  // for (let i = 0; i < Number(oldRoleMemberCount); i++) {
  //   console.log(await battle.getRoleMember(role, i));
  // }

  // const cnt = 100;
  // const wallets = await getWallets(cnt);
  // for (let i = 0; i < wallets.length; i++) {
  //   console.log(
  //     `wallet ${
  //       i + 1
  //     } -------------------------------------------------------------`,
  //   );
  //   console.log(`address: ${wallets[i].address}`);
  //   await (await battle.grantRole(role, wallets[i].address)).wait();
  //   console.log(`DONE!!!`);
  // }

  // console.log("After : ");
  // const newRoleMemberCount = await battle.getRoleMemberCount(role);
  // for (let i = 0; i < Number(newRoleMemberCount); i++) {
  //   console.log(await battle.getRoleMember(role, i));
  // }

  // DEFAULT_ADMIN_ROLE
  // (await battle.setGameRole()).wait();
}

setAdminRole().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
