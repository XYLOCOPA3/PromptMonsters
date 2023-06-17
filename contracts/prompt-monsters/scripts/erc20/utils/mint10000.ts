import { ERC20_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function mint10000() {
  // const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212"; // keit-dev
  // const address: string = "0x09E7bd5A64C4D9CC341DE0aB894505C67D123d40"; // kimi-dev
  const address: string = "0xEef377Bdf67A227a744e386231fB3f264C158CDF"; // yawn-dev

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
