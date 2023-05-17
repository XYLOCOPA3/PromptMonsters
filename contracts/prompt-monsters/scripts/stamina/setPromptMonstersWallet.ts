import { PROMPT_MONSTERS_WALLET, STAMINA_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");

  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  console.log("setPromptMonstersWallet");
  console.log(`Before: ${await stamina.promptMonstersWallet()}`);
  await (await stamina.setPromptMonstersWallet(PROMPT_MONSTERS_WALLET)).wait();
  console.log(`After : ${await stamina.promptMonstersWallet()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
