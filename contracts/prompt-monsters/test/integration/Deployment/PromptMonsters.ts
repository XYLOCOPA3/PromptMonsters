import { mintPrice } from "../../../scripts/prompt-monsters/mintPrice";
import { externalLink } from "../../helpers/test_constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployPromptMonsters = async (
  deployer: SignerWithAddress,
  erc20Address: string,
  promptMonstersWallet: SignerWithAddress,
) => {
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonstersProxy = await upgrades.deployProxy(
    PromptMonsters,
    [externalLink, erc20Address, mintPrice, promptMonstersWallet],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersProxy.connect(deployer).deployed();

  const promptMonsters = PromptMonsters.attach(promptMonstersProxy.address);

  return { promptMonsters };
};
