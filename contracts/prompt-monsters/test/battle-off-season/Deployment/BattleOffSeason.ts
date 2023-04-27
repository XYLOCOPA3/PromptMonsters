import { ethers, upgrades } from "hardhat";

export async function deployBattleOffSeason() {
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
  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeasonProxy = await upgrades.deployProxy(
    BattleOffSeason,
    [battleLeaderBoard.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleOffSeasonProxy.deployed();

  const battleOffSeason = BattleOffSeason.attach(battleOffSeasonProxy.address);

  return {
    battleOffSeason,
    battleLeaderBoard,
  };
}
