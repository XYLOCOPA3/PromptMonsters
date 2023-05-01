import { ERC20 } from "../../../typechain-types";
import { initialMintPrice } from "../../helpers/test_constants";
import { externalLink } from "../../helpers/test_constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployPromptMonsters = async (
  deployer: SignerWithAddress,
  erc20: ERC20,
  promptMonstersWallet: SignerWithAddress,
) => {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonstersProxy = await upgrades.deployProxy(
    PromptMonsters,
    [
      externalLink,
      erc20.address,
      initialMintPrice,
      promptMonstersWallet.address,
    ],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersProxy.connect(deployer).deployed();

  const promptMonsters = PromptMonsters.attach(promptMonstersProxy.address);

  return { promptMonsters };
};
