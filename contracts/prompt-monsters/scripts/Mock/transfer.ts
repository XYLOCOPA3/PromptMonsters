import { MCHC_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function transfer() {
  const MCHCoin = await ethers.getContractFactory("MCHCoin");

  const mchCoin = MCHCoin.attach(MCHC_ADDRESS);

  const address: string = "0x8Bcd35185a8068BB197BC957f7dDFEE77007BF3A";

  // const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212";
  // const address: string = "0x1Ae3d1C13A255deF3Eafc3fEa7c26bf6D37EfDe6";

  console.log(address);
  console.log(await mchCoin.balanceOf(address));

  (await mchCoin.transfer(address, ethers.utils.parseEther("2000"))).wait();

  console.log(await mchCoin.balanceOf(address));
  // console.log(process.argv);
  // const args = process.argv.slice(2);
  // console.log(args);
}

transfer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
