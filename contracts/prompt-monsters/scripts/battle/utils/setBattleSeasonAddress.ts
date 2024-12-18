import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function setBattleSeasonAddress() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  const seasonId: number = 1;
  const address: string = "0x250548D3B864d705Dd2D5a3f92D1B962145335cf";

  console.log("address: ", address);

  (await battle.setBattleSeasonAddress(seasonId, address)).wait();
}

setBattleSeasonAddress().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
