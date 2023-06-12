import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Battle = await ethers.getContractFactory("TestB");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  console.log(await battle.getSeasonBattleDataByMonsterId(1, 195));
  console.log(await battle.getSeasonMatchCount(1, 195));
  console.log(await battle.getSeasonWinCount(1, 195));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
