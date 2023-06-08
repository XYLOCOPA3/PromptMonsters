import { BATTLE_S1_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battles1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);

  const startBlockHeight = 21342240;

  const createLogsTmp = await battles1.queryFilter(
    battles1.filters.MatchCount(null, null),
    startBlockHeight,
    startBlockHeight + 10000,
  );

  if (createLogsTmp.length === 0) return;

  for (let i = 0; i < createLogsTmp.length; i++) {
    console.log(createLogsTmp[i].args.monsterId.toString());
    console.log(createLogsTmp[i].args.matchCount.toString());
    const t = await createLogsTmp[i].getBlock();
    console.log(
      new Date(t.timestamp * 1000).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      }),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
