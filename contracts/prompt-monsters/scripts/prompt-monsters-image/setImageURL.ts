import { PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const monsterId = 1;
  const imageURL =
    "https://ipfs.io/ipfs/bafkreiek74pvvjiq4f56adymrdkmetyuuzk6jjou2gngvfaw2i4qsxrcgy"; // png
  // "https://ipfs.io/ipfs/bafkreig7lsvbbq6vofdc4thytvk76ipipggj3w4cesj2v4neqdtm3rv4le"; // jpg
  // "https://ipfs.io/ipfs/bafkreia76orifnxdbdoon5ciwcd5ivbdm7lotaf2vfgumhapsoxjaytpoy"; // svg
  // "https://bafybeieqiivfaxxwkvxb6tmssrwsmktokly7t57p6mq57agsppexde7iiq.ipfs.w3s.link/ice-slime.svg"; // svg

  const PromptMonstersImage = await ethers.getContractFactory(
    "PromptMonstersImage",
  );
  const promptMonstersImage = PromptMonstersImage.attach(
    PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  );
  console.log("Before: ", await promptMonstersImage.imageURL(monsterId));
  await (await promptMonstersImage.setImageURL(monsterId, imageURL)).wait();
  console.log("After : ", await promptMonstersImage.imageURL(monsterId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
