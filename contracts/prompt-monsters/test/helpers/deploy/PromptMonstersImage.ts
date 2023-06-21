import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployPromptMonstersImage = async (
  deployer: SignerWithAddress,
  promptMonstersAddress: string,
) => {
  const PromptMonstersImage = await ethers.getContractFactory(
    "PromptMonstersImage",
  );
  const promptMonstersImageProxy = await upgrades.deployProxy(
    PromptMonstersImage,
    [promptMonstersAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersImageProxy.connect(deployer).deployed();

  const promptMonstersImage = PromptMonstersImage.attach(
    promptMonstersImageProxy.address,
  );

  return { promptMonstersImage };
};
