import { ethers, upgrades } from "hardhat";

export async function deployLeaderBoardForBattle() {
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
  const s1forBattleProxy = await upgrades.deployProxy(
    S1ForBattle,
    [leaderBoardForBattle.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await s1forBattleProxy.deployed();

  const s1forBattle = S1ForBattle.attach(s1forBattleProxy.address);

  return {
    leaderBoardForBattle,
    s1forBattle,
  };
}
