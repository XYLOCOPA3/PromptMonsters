import { MOCK_ERC20_ADDRESS, PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  console.log("setErc20: ", MOCK_ERC20_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log(`Before: ${await promptMonsters.erc20()}`);
  await (await promptMonsters.setErc20(MOCK_ERC20_ADDRESS)).wait();
  console.log(`After : ${await promptMonsters.erc20()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
