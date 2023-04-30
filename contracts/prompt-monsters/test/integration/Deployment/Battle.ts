import { ethers, upgrades } from "hardhat";

export async function deployBattle() {
  const [deployer] = await ethers.getSigners();
  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.deployProxy(
    Battle,
    [deployer.address, deployer.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleProxy.deployed();

  const battle = Battle.attach(battleProxy.address);

  return {
    battle,
  };
}
