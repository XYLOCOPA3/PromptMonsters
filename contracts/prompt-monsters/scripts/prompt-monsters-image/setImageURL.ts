import { PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const monsterId = 1;
  const imageURL = "";

  const PromptMonstersImage = await ethers.getContractFactory(
    "PromptMonstersImage",
  );
  const promptMonstersImage = PromptMonstersImage.attach(
    PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  );
  console.log("Before: ", await promptMonstersImage.imageURL(monsterId));
  await (await promptMonstersImage.setImageURL(imageURL)).wait();
  console.log("After : ", await promptMonstersImage.imageURL(monsterId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
