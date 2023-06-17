import { RESTORE_PRICE, STAMINA_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");

  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  console.log("setRestorePrice");
  console.log(`Before: ${await stamina.restorePrice()}`);
  await (await stamina.setRestorePrice(RESTORE_PRICE)).wait();
  console.log(`After : ${await stamina.restorePrice()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
