import { STAMINA_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");
  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
