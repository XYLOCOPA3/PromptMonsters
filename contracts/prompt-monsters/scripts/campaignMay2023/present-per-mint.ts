import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const totalSupply = promptMonsters.getMonstersTotalSupply();
  console.log(`totalSupply: ${totalSupply}`);

  console.log("");
  console.log(
    "---------------------------------- owner address list for tokenID ----------------------------------",
  );

  const owners: any[] = [];

  for (var i = 0; i < (await totalSupply).toNumber(); i++) {
    owners[i] = promptMonsters.ownerOf(i);
    console.log("No." + i + "  " + owners[i]);
  }

  console.log("");
  console.log(
    "---------------------------------- unique owner address list ----------------------------------",
  );

  const uniqueOwners: any[] = Array.from(new Set(owners));

  for (var i = 0; i < uniqueOwners.length; i++) {
    console.log("No." + i + "  " + uniqueOwners[i]);
  }

  console.log("");
  console.log(
    "---------------------------------- Initializing associative array ----------------------------------",
  );

  const object: { [key: string]: number } = {};

  for (var i = 0; i < uniqueOwners.length; i++) {
    object[uniqueOwners[i].toString()] = 0;
  }

  for (const key in object) {
    const value = object[key];
    console.log("key: [" + key + "] value:[" + value + "]");
  }

  console.log("");
  console.log(
    "---------------------------------- number of monsters for unique owner address ----------------------------------",
  );

  for (var key of Object.keys(object)) {
    for (var j of owners) {
      if (key == owners[j].toString()) {
        object[key] = object[key] + 1;
      }
    }
  }

  for (const key in object) {
    const value = object[key];
    console.log("key: [" + key + "] value:[" + value + "]");
  }

  console.log("");
  console.log(
    "---------------------------------- send 10 OAS to unique owners ----------------------------------",
  );

  // 送金処理
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
