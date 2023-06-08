import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployDistributor = async (
  deployer: SignerWithAddress,
  promptMonstersAddress: string,
) => {
  const Distributor = await ethers.getContractFactory("Distributor");
  const distributorProxy = await upgrades.deployProxy(
    Distributor,
    [promptMonstersAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await distributorProxy.connect(deployer).deployed();

  const distributor = Distributor.attach(distributorProxy.address);

  return {
    distributor,
  };
};
