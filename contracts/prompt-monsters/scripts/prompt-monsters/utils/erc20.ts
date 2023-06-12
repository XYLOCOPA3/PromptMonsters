import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function mintPrice() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  const Battle = await ethers.getContractFactory("TestB");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);
  console.log(BATTLE_PROXY_ADDRESS);

  const results = await battle.getSeasonBattleData(1);
  console.log(results);

  // const pm = await stamina.promptMonsters();
  // console.log(pm);
  // const role = ethers.utils.id("GAME_ROLE");
  // console.log("Before: ");
  // const oldRoleMemberCount = await stamina.getRoleMemberCount(role);
  // for (let i = 0; i < Number(oldRoleMemberCount); i++) {
  //   console.log(await stamina.getRoleMember(role, i));
  // }

  // const PromptMonsters = await ethers.getContractFactory("TestPM");

  // const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  // console.log(PROMPT_MONSTERS_PROXY_ADDRESS);
  // // const mintPrice = await promptMonsters.mintPrice();
  // // console.log(mintPrice);
  // let erc20 = await promptMonsters.erc20();
  // console.log(erc20);
  // await (
  //   await promptMonsters.setErc20("0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3")
  // ).wait();
  // erc20 = await promptMonsters.erc20();
  // console.log(erc20);
}

mintPrice().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
