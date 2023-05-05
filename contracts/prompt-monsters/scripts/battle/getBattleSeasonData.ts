import { BATTLE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function getSeasonBattleDataByMonsterId() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  const seasonId = 1;
  const monsterId = 615;
  console.log("getSeasonBattleDataByMonsterId ------------------");
  console.log(await battle.getSeasonBattleDataByMonsterId(seasonId, monsterId));
  console.log("getSeasonWinCount ------------------");
  console.log(await battle.getSeasonWinCount(seasonId, monsterId));
  console.log("getSeasonMatchCount ------------------");
  console.log(await battle.getSeasonMatchCount(seasonId, monsterId));
}

getSeasonBattleDataByMonsterId().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
