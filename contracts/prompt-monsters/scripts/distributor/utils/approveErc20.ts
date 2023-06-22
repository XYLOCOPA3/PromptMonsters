import { DISTRIBUTOR_PROXY_ADDRESS, ERC20_ADDRESS } from "../../const";
import { ethers } from "hardhat";

const PRIZE = "1";

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = Erc20.attach(ERC20_ADDRESS);

  const results1 = await Promise.all([
    erc20.balanceOf(from.address),
    erc20.allowance(from.address, DISTRIBUTOR_PROXY_ADDRESS),
  ]);
  const balanceOfMchc1 = results1[0];
  const allowance1 = results1[1];
  console.log("Before --------------");
  console.log("balanceOfMchc: ", balanceOfMchc1.toString());
  console.log("allowance: ", allowance1.toString());

  // const tx = await erc20
  //   .connect(from)
  //   .approve(DISTRIBUTOR_PROXY_ADDRESS, ethers.constants.MaxUint256);
  // await tx.wait();

  const results2 = await Promise.all([
    erc20.balanceOf(from.address),
    erc20.allowance(from.address, DISTRIBUTOR_PROXY_ADDRESS),
  ]);
  const balanceOfMchc2 = results2[0];
  const allowance2 = results2[1];
  console.log("After --------------");
  console.log("balanceOfMchc: ", balanceOfMchc2.toString());
  console.log("allowance: ", allowance2.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
