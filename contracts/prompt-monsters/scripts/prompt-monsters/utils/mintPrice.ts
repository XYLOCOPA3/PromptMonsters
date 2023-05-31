import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function mintPrice() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");

  const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212";

  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const mintPrice = await promptMonsters.mintPrice();
  console.log(mintPrice);
}

mintPrice().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
