import { ethers, upgrades } from "hardhat";

export async function deployPromptMonstersItem() {
  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItemProxy = await upgrades.deployProxy(
    PromptMonstersItem,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersItemProxy.deployed();
  const promptMonstersItem = PromptMonstersItem.attach(
    promptMonstersItemProxy.address,
  );
  return {
    promptMonstersItem,
  };
}
