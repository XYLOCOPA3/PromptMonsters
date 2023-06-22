import {
  DISTRIBUTOR_ERC20_ADDRESS,
  DISTRIBUTOR_PROXY_ADDRESS,
  DISTRIBUTOR_WALLET,
} from "../const";
import console from "console";
import { ethers } from "hardhat";

async function main() {
  const erc20Address = DISTRIBUTOR_ERC20_ADDRESS;
  const distributorWallet = DISTRIBUTOR_WALLET;

  console.log("---------------------------------------------");
  console.log("--- Start Distributor Post Deploy -----------");
  console.log("---------------------------------------------");
  console.log("");

  const addr = DISTRIBUTOR_PROXY_ADDRESS;
  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(addr);

  console.log("setERC20Address -----------------------------");
  console.log(`Before: ${await distributor.getERC20()}`);
  await (await distributor.setERC20Address(erc20Address)).wait();
  console.log(`After : ${await distributor.getERC20()}`);

  console.log("setDistributorWallet -----------------------------");
  console.log(`Before: ${await distributor.getDistributorWallet()}`);
  await (await distributor.setDistributorWallet(distributorWallet)).wait();
  console.log(`After : ${await distributor.getDistributorWallet()}`);

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Distributor Post Deploy -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
