import { ethers, upgrades } from "hardhat";

export async function deployBattleS1() {
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
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [battleLeaderBoard.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.deployed();

  const battleS1 = BattleS1.attach(battleS1Proxy.address);

  return {
    battleS1,
    battleLeaderBoard,
  };
}
