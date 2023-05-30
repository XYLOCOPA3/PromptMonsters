import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const totalSupply = await promptMonsters.getMonstersTotalSupply();
  console.log(`totalSupply: ${totalSupply}`);

  console.log("");
  console.log(
    "---------------------------------- owner address list for tokenID ----------------------------------",
  );

  const owners: any[] = [];

  for (var i = 0; i < totalSupply.toNumber(); i++) {
    owners.push(promptMonsters.ownerOf(i));
    console.log("No." + i + "  " + owners[i]);
  }

  /*console.log("");
  console.log(
    "---------------------------------- send 10 OAS to unique owners ----------------------------------",
  );

  // XYLOCOPAのウォレットから送金する処理*/
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
