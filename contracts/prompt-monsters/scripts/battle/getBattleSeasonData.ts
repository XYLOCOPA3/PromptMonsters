import { BATTLE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function getSeasonBattleDataByMonsterId() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  const monsterId = 10;
  console.log("getSeasonBattleDataByMonsterId ------------------");
  console.log(await battle.getSeasonBattleDataByMonsterId(0, monsterId));
  console.log("getSeasonWinCount ------------------");
  console.log(await battle.getSeasonWinCount(0, monsterId));
  console.log("getSeasonMatchCount ------------------");
  console.log(await battle.getSeasonMatchCount(0, monsterId));
}

getSeasonBattleDataByMonsterId().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
