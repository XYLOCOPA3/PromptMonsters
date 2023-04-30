import { ethers } from "hardhat";

export async function deployErc20() {
  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = await Erc20.deploy();
  await erc20.deployed();

  return { erc20 };
}
