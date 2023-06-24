import { ethers, upgrades } from "hardhat";

export async function deployDistributor() {
  const Distributor = await ethers.getContractFactory("Distributor");
  const distributorProxy = await upgrades.deployProxy(Distributor, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await distributorProxy.deployed();
  const distributor = Distributor.attach(distributorProxy.address);
  return {
    distributor,
  };
}
