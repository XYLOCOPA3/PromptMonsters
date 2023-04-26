import { ethers, upgrades } from "hardhat";

export async function deployS1ForBattle() {
  const LeaderBoardForBattle = await ethers.getContractFactory(
    "LeaderBoardForBattle",
  );
  const leaderBoardForBattleProxy = await upgrades.deployProxy(
    LeaderBoardForBattle,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await leaderBoardForBattleProxy.deployed();

  const leaderBoardForBattle = LeaderBoardForBattle.attach(
    leaderBoardForBattleProxy.address,
  );
  const S1ForBattle = await ethers.getContractFactory("S1ForBattle");
  const s1ForBattleProxy = await upgrades.deployProxy(
    S1ForBattle,
    [leaderBoardForBattle.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await s1ForBattleProxy.deployed();

  const s1ForBattle = S1ForBattle.attach(s1ForBattleProxy.address);

  return {
    s1ForBattle,
    leaderBoardForBattle,
  };
}
