import { DISTRIBUTOR_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

// ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
// 送金量！！！適宜変更すること！
const PRIZE = "200";
// ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(DISTRIBUTOR_PROXY_ADDRESS);

  const owners: string[] = [];

  // キャンペーン
  // https://twitter.com/prompt_monsters/status/1671375546947899392
  // owners.push(
  //   "0x2c61f52716BB923b1c712A9aad1997EEa35e97Eb",
  //   "0x38692E3B8a6b2E17bb0fdFedcB0fbe3A746e8f2d",
  //   "0x775F118Ef9F26278A6BeeB2027a9eCF43bf83466",
  //   "0x39dED525f0de9b31a7CD99ee148BE8Fa900a1164",
  //   "0xea5F0eb9158Ca4d29886ca8606b3D2028e8C324b",
  //   "0xb3923702e04cecd2726D0026e2154b3488e5B7e2",
  //   "0x4752D96A0564728c596ae067844c2d1EDFf37131",
  //   "0x508c68b4287AB8A9636be799a52B4B6D75eBbFF8",
  //   "0xcB0201253Ea36591721F0d32CBF1E2C28Da87FEf",
  //   "0x88E4B4d4c97b2797be8A0a19BEf9f25036212ffb",
  //   "0xD51f2539621f095E5a4b6487001719677d46c39B",
  //   "0xf7242B961394e655d399478fDF7a9606F6730071",
  //   "0x0A5aBC4eEF196994abb9cd34fa8FE9229Ce53e4f",
  //   "0xE9b1E0fDd904d9840c10473D28DFd2D97ED5a5cF",
  //   "0xD49B22C7A353E9342190F3da03fE458Cd3E62855",
  // );

  console.log(owners);

  console.log(
    "-------------------- execute distribution for ranking rewards --------------------",
  );

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    "報酬配布を実行しても良い場合はyesと入力してください。: ",
    async (answer: string) => {
      if (answer !== "yes") {
        console.error("報酬配布中止");
        rl.close();
        return;
      }
      for (let i = 0; i < owners.length; i++) {
        console.log(i + 1, PRIZE, owners[i]);
        // const tx = await distributor
        //   .connect(from)
        //   .distributeERC20(owners[i], ethers.utils.parseEther(PRIZE));
        // await tx.wait();
      }
      console.log("対象ユーザーへ報酬が配布されました。");

      console.log("-------------------- Done! --------------------");
      rl.close();
    },
  );
  rl.on("close", () => {
    process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
