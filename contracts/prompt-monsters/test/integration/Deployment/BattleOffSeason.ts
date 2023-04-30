import { ethers, upgrades } from "hardhat";

export async function deployBattleOffSeason() {
  const [deployer] = await ethers.getSigners();
  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeasonProxy = await upgrades.deployProxy(
    BattleOffSeason,
    [deployer.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleOffSeasonProxy.deployed();

  const battleOffSeason = BattleOffSeason.attach(battleOffSeasonProxy.address);

  return {
    battleOffSeason,
  };
}
