import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

export const deployErc20 = async (deployer: SignerWithAddress) => {
  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = await Erc20.connect(deployer).deploy();
  await erc20.deployed();

  await(await erc20.mint(deployer.address, ethers.utils.parseEther("1000000000"))).wait();

  return { erc20 };
};
