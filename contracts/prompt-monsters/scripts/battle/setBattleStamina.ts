import { BATTLE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  console.log(`Before: ${await battle.battleStamina()}`);
  await (await battle.setBattleStamina(ethers.BigNumber.from(1))).wait();
  console.log(`After : ${await battle.battleStamina()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
