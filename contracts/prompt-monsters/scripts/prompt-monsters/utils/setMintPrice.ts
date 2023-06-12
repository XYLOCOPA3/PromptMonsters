import { MINT_PRICE, PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("TestPM");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log(`Before: ${await promptMonsters.getMintPrice()}`);
  await (await promptMonsters.setMintPrice(MINT_PRICE)).wait();
  console.log(`After : ${await promptMonsters.getMintPrice()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
