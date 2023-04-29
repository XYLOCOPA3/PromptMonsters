import { MCHC_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function balanceOf() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  const Erc20 = await ethers.getContractFactory("Erc20");

  const address: string = "0x159EeF981fDc77927a77A4e5769Ee7E6C03Fb6fC";

  const erc20 = Erc20.attach(MCHC_ADDRESS);

  const balanceOf = await erc20.balanceOf(address);
  console.log(balanceOf);
}

balanceOf().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
