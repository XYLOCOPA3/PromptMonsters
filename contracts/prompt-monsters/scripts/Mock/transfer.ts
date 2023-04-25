import { MCHC_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function transfer() {
  const MCHCoin = await ethers.getContractFactory("MCHCoin");

  const mchCoin = MCHCoin.attach(MCHC_PROXY_ADDRESS);

  const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212";

  console.log(address);
  console.log(await mchCoin.balanceOf(address));

  (await mchCoin.transfer(address, ethers.utils.parseEther("2000"))).wait();

  console.log(await mchCoin.balanceOf(address));
}

transfer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
