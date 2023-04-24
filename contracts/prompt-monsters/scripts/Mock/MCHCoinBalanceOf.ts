import { MCHC_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function transferMCHCoin() {
  const MCHCoin = await ethers.getContractFactory("MCHCoin");

  const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212";

  const mchCoin = MCHCoin.attach(MCHC_PROXY_ADDRESS);

  const balanceOf = await mchCoin.balanceOf(address);
  console.log("Hello");
}
