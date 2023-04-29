import { STAMINA_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");

  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  console.log("staminaLimit");
  console.log(`Before: ${await stamina.staminaLimit()}`);
  await (await stamina.setStaminaLimit(ethers.BigNumber.from(3))).wait();
  console.log(`After : ${await stamina.staminaLimit()}`);
  console.log(`Before: ${await stamina.staminaRecoveryTime()}`);
  await (
    await stamina.setStaminaRecoveryTime(ethers.BigNumber.from(28800))
  ).wait();
  console.log(`After : ${await stamina.staminaRecoveryTime()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
