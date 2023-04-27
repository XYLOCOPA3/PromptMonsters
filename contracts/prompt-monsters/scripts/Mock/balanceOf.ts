import { MCHC_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function balanceOf() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  const MCHCoin = await ethers.getContractFactory("MCHCoin");

  const address: string = "0x159EeF981fDc77927a77A4e5769Ee7E6C03Fb6fC";

  const mchCoin = MCHCoin.attach(MCHC_ADDRESS);

  const balanceOf = await mchCoin.balanceOf(address);
  console.log(balanceOf);
}

balanceOf().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
