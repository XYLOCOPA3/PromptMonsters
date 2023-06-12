import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployPromptMonstersExtension = async (
  deployer: SignerWithAddress,
) => {
  const PromptMonstersExtension = await ethers.getContractFactory("TestPME");
  const promptMonstersExtensionProxy = await upgrades.deployProxy(
    PromptMonstersExtension,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersExtensionProxy.connect(deployer).deployed();

  const promptMonstersExtension = PromptMonstersExtension.attach(promptMonstersExtensionProxy.address);

  return { promptMonstersExtension };
};
