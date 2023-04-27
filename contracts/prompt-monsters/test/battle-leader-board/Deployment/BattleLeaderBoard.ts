import { ethers, upgrades } from "hardhat";

export async function deployBattleLeaderBoard() {
  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );
  const battleLeaderBoardProxy = await upgrades.deployProxy(
    BattleLeaderBoard,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleLeaderBoardProxy.deployed();

  const battleLeaderBoard = BattleLeaderBoard.attach(
    battleLeaderBoardProxy.address,
  );

  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const s1forBattleProxy = await upgrades.deployProxy(
    BattleS1,
    [battleLeaderBoard.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await s1forBattleProxy.deployed();

  const s1forBattle = BattleS1.attach(s1forBattleProxy.address);

  return {
    battleLeaderBoard,
    s1forBattle,
  };
}
