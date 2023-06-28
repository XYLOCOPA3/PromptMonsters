import { ERC20_ADDRESS } from "../../const";
import { ethers } from "hardhat";

const PRIZE = "1";

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(ERC20_ADDRESS);

  console.log("setDistributorWallet -----------------------------");
  console.log(`Before: ${await distributor.getDistributorWallet()}`);
  await (await distributor.setDistributorWallet(from.address)).wait();
  console.log(`After : ${await distributor.getDistributorWallet()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
