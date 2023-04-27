import { PromptMonsters } from "../../../typechain-types";
import { deployMchCoin } from "./MchCoin";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";
import { ethers, upgrades } from "hardhat";

export async function deployPromptMonsters() {
  const { mchCoin } = await loadFixture(deployMchCoin);

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
  return { promptMonsters, mchCoin };
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
