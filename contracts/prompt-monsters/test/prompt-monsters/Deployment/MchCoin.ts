import { ethers } from "hardhat";

export async function deployMchCoin() {
  const MCHCoin = await ethers.getContractFactory("MCHCoin");
  const mchCoin = await MCHCoin.deploy();
  await mchCoin.deployed();

  return { mchCoin };
}
