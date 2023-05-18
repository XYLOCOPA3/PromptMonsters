import { PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const monsterId = 504;
  const imageURL =
    // "https://ipfs.io/ipfs/bafkreief46e6uokwtt6j5nemlp3imsygbv2pcnc3h2kwjalqa5m4bomapm"; // id: 0, prompt dragon
    "https://ipfs.io/ipfs/bafkreigsygmfdwm4vxgv77vcfm7nimhilqsxdzq32qnji3vbrcp6i2aog4"; // id: 504, 創世の巨神 スザンヌ

  const PromptMonstersImage = await ethers.getContractFactory(
    "PromptMonstersImage",
  );
  const promptMonstersImage = PromptMonstersImage.attach(
    PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  );
  const befImageURL = await promptMonstersImage.imageURL(monsterId);
  console.log("Before: ", befImageURL);
  if (befImageURL !== "") {
    console.log(
      "既に画像が設定されています。変更したい場合はこちらのif文をコメントアウトしてください。",
    );
    return;
  }
  await (await promptMonstersImage.setImageURL(monsterId, imageURL)).wait();
  console.log("After : ", await promptMonstersImage.imageURL(monsterId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
