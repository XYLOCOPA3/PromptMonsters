import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function get() {
  const [deployer] = await ethers.getSigners();
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");

  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  // const address: string = "0x250548D3B864d705Dd2D5a3f92D1B962145335cf";
  const address: string = "0xEef377Bdf67A227a744e386231fB3f264C158CDF";
  // const address: string = "0x8Bcd35185a8068BB197BC957f7dDFEE77007BF3A";
  // const address: string = "0x31F31693723c4397cb8A978A19A95B82c72f4212";
  // const address: string = "0x1Ae3d1C13A255deF3Eafc3fEa7c26bf6D37EfDe6";

  console.log("address: ", address);

  console.log(
    "balance of PromptMonsters: ",
    await promptMonsters.balanceOf(address),
  );

  const tokenIds = await promptMonsters.getOwnerToTokenIds(address);
  console.log("Token IDs: ", tokenIds);

  console.log("Token URI: ", await promptMonsters.getMonsters(tokenIds));
}

get().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
