import { STAMINA_PROXY_ADDRESS, STAMINA_WALLET } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");

  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  console.log("setErc20");
  console.log(`Before: ${await stamina.erc20()}`);
  await (await stamina.setErc20(STAMINA_WALLET)).wait();
  console.log(`After : ${await stamina.erc20()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
