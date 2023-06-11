import { deployPromptMonsters } from "./PromptMonsters";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";

export async function deployStamina() {
  const { promptMonsters, erc20 } = await loadFixture(deployPromptMonsters);

  const Stamina = await ethers.getContractFactory("TestS");
  const staminaProxy = await upgrades.deployProxy(
    Stamina,
    [promptMonsters.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await staminaProxy.deployed();

  const stamina = Stamina.attach(staminaProxy.address);

  return {
    stamina,
    promptMonsters,
    erc20,
  };
}
