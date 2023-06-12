import { PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const monsterId = 386;
  const imageURL =
    // "https://ipfs.io/ipfs/bafkreief46e6uokwtt6j5nemlp3imsygbv2pcnc3h2kwjalqa5m4bomapm"; // id: 0, prompt dragon
    // "https://ipfs.io/ipfs/bafkreigsygmfdwm4vxgv77vcfm7nimhilqsxdzq32qnji3vbrcp6i2aog4"; // id: 504, 創世の巨神 スザンヌ
    // "https://ipfs.io/ipfs/bafkreidomgsyco4v3t3at5jmm4njqdk45psknnuxeru4p3ekgzfb5wldw4"; // id: 259, メンタイコドラゴン
    // "https://ipfs.io/ipfs/bafkreihi7x5iqz6gl7t77xeugfurgtzhpicrdhq7hpnv3rwbz4wrnt42ei"; // id: 164, 魔王サルマン
    // "https://ipfs.io/ipfs/bafkreifcjc4mt5qhquc34bmmut5zk6qj5qgglpk46lscbnzna2ztn7tdvi"; // id: 284, マグロス
    // "https://ipfs.io/ipfs/bafkreidznj5amp67lx35w2hjtfm46whrumyq5juv3uxd5jqcl2t4cooqsq"; // id: 707, ミステリア
    // "https://ipfs.io/ipfs/bafkreigdz2eiicb6deq34422622r7gpfgbvn2to6rzghg6kwrlmp4xkmtq"; // id: 816, ジジイ童話家
    // "https://ipfs.io/ipfs/bafkreifd3iebqp3lerziuxhy5k5pbmlufdg4bjgjo6jc323pau7b764tty"; // id: 476, コンプリートモンスター
    // "https://ipfs.io/ipfs/bafkreiekgv6h3ubhfdwjxeebcvzqtwkcq5s2vrqkimiab7xgapdcypjqdu"; // id: 767, ゼロクロニクル
    // "https://ipfs.io/ipfs/bafkreieisgiybxwfitgqc3qfladj4xlewdhjfd5qzbr2ondrxlqoofm7cu"; // id: 161, Poseifish
    "https://ipfs.io/ipfs/bafkreidtes2p7rjogbqbbgxiubr2t2svd3fle6cf4wa4almydj7752udh4"; // id: 386, 聖天使マリア

  const PromptMonstersImage = await ethers.getContractFactory(
    "TestPMI",
  );
  const promptMonstersImage = PromptMonstersImage.attach(
    PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS,
  );
  const befImageURL = await promptMonstersImage.getImageURL(monsterId);
  console.log("Before: ", befImageURL);
  if (befImageURL !== "") {
    console.log(
      "既に画像が設定されています。変更したい場合はこちらのif文をコメントアウトしてください。",
    );
    return;
  }
  await (await promptMonstersImage.setImageURL(monsterId, imageURL)).wait();
  console.log("After : ", await promptMonstersImage.getImageURL(monsterId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
