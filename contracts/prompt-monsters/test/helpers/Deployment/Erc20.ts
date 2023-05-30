import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

export const deployErc20 = async (deployer: SignerWithAddress) => {
  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = await Erc20.connect(deployer).deploy();
  await erc20.deployed();

  return { erc20 };
};
