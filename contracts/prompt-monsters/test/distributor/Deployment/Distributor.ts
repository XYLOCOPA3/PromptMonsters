import { deployPromptMonsters } from "./PromptMonsters";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";

export async function deployDistributor() {
  const { promptMonsters, erc20 } = await loadFixture(deployPromptMonsters);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributorProxy = await upgrades.deployProxy(
    Distributor,
    [promptMonsters.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await distributorProxy.deployed();

  const distributor = Distributor.attach(distributorProxy.address);

  return {
    distributor,
    promptMonsters,
    erc20,
  };
}
