import { PromptMonsters } from "../../../typechain-types";
import { deployErc20 } from "../../helpers/Deployment/Erc20";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";
import { ethers, upgrades } from "hardhat";

export async function deployPromptMonsters() {
  const { erc20 } = await loadFixture(deployErc20);

  const [deployer, user1, promptMonstersWallet] = await ethers.getSigners();

  const promptMonstersArgs: promptMonstersInitArgs = {
    externalLink: "https://prompt-monsters.com/",
    erc20Address: erc20.address,
    mintPrice: ethers.utils.parseEther("100"),
    promptMonstersWallet: promptMonstersWallet.address,
  };

  const PromptMonsters = await ethers.getContractFactory("TestPM");
  const promptMonstersProxy = await upgrades.deployProxy(
    PromptMonsters,
    [
      promptMonstersArgs.externalLink,
      promptMonstersArgs.erc20Address,
      promptMonstersArgs.mintPrice,
      promptMonstersArgs.promptMonstersWallet,
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
  return { promptMonsters, erc20 };
}

export type PromptMonstersArgs = {
  contract: PromptMonsters;
  args: promptMonstersInitArgs;
};

export type promptMonstersInitArgs = {
  externalLink: string;
  erc20Address: string;
  mintPrice: BigNumber;
  promptMonstersWallet: string;
};
