import { PromptMonsters } from "../../../typechain-types";
import { ethers, upgrades } from "hardhat";

export async function deployPromptMonsters() {
  const promptMonstersArgs: promptMonstersInitArgs = {
    externalLink: "https://prompt-monsters-jp.azurewebsites.net/",
  };

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonstersProxy = await upgrades.deployProxy(
    PromptMonsters,
    [promptMonstersArgs.externalLink],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersProxy.deployed();

  const promptMonsters = PromptMonsters.attach(promptMonstersProxy.address);

  const args: PromptMonstersArgs = {
    contract: promptMonsters,
    args: promptMonstersArgs,
  };
  return args;
}

export type PromptMonstersArgs = {
  contract: PromptMonsters;
  args: promptMonstersInitArgs;
};

export type promptMonstersInitArgs = {
  externalLink: string;
};
