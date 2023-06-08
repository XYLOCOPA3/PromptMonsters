import { ERC20_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function mint10000() {
  const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212";

  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = Erc20.attach(ERC20_ADDRESS);

  console.log("mint10000 ---------------------------");
  console.log("mint to ", address);
  console.log(`Before: ${await erc20.balanceOf(address)}`);
  (await erc20.mint10000(address)).wait();
  console.log(`After : ${await erc20.balanceOf(address)}`);
}

mint10000().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
