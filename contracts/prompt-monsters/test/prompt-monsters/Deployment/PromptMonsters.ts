import { PromptMonsters } from "../../../typechain-types";
import { BigNumber } from "ethers";
import { ethers, upgrades } from "hardhat";

export async function deployPromptMonsters() {
  const MCHCoin = await ethers.getContractFactory("MCHCoin");
  const mchCoin = await MCHCoin.deploy();
  await mchCoin.deployed();

  const promptMonstersArgs: promptMonstersInitArgs = {
    externalLink: "https://prompt-monsters-jp.azurewebsites.net/",
    mchCoinAddress: mchCoin.address,
    mintPrice: ethers.utils.parseEther("100"),
  };

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonstersProxy = await upgrades.deployProxy(
    PromptMonsters,
    [
      promptMonstersArgs.externalLink,
      promptMonstersArgs.mchCoinAddress,
      promptMonstersArgs.mintPrice,
    ],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersProxy.deployed();

  const promptMonsters = PromptMonsters.attach(promptMonstersProxy.address);

  // const args: PromptMonstersArgs = {
  //   promptMonsters: promptMonsters,
  //   args: promptMonstersArgs,
  // };
  return { promptMonsters: promptMonsters, mchCoin: mchCoin };
}

export type PromptMonstersArgs = {
  contract: PromptMonsters;
  args: promptMonstersInitArgs;
};

export type promptMonstersInitArgs = {
  externalLink: string;
  mchCoinAddress: string;
  mintPrice: BigNumber;
};
