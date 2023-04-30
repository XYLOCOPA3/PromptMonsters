import { ethers, upgrades } from "hardhat";

export async function deployBattleS1() {
  const [deployer] = await ethers.getSigners();
  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [deployer.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.deployed();

  const battleS1 = BattleS1.attach(battleS1Proxy.address);

  return {
    battleS1,
  };
}
