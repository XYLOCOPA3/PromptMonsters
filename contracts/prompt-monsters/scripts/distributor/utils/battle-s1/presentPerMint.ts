import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../../const";
import { DISTRIBUTOR_PROXY_ADDRESS } from "../../../const";
import { ethers } from "hardhat";

const PROMPT_MONSTERS_DEPLOY_BH = 21342235;
const PROMPT_MONSTERS_LAST_MINTED_BH = 22519167;
const PRIZE = "10";

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(DISTRIBUTOR_PROXY_ADDRESS);

  const startBlockHeight = PROMPT_MONSTERS_DEPLOY_BH;
  const endBlockHeight = PROMPT_MONSTERS_LAST_MINTED_BH;

  const mintedMonsterEvents = await promptMonsters.queryFilter(
    promptMonsters.filters.MintedMonster(null, null, null),
    startBlockHeight,
    endBlockHeight,
  );

  if (mintedMonsterEvents.length === 0) {
    console.error(`MintedMonsterイベントが見つかりませんでした。`);
    return;
  }

  console.log("-------------------- Get owners --------------------");

  const owners: { address: string; tokenId: string }[] = [];

  for (var i = 0; i < mintedMonsterEvents.length; i++) {
    owners.push({
      address: mintedMonsterEvents[i].args.tokenOwner,
      tokenId: mintedMonsterEvents[i].args.newTokenId.toString(),
    });
    console.log(owners[i].tokenId, owners[i].address);
  }

  console.log(
    "-------------------- execute distribution for present per mint --------------------",
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
      for (var i = 0; i < owners.length; i++) {
        console.log(owners[i].tokenId, PRIZE, owners[i].address);
        // const tx = await distributor
        //   .connect(from)
        //   .distributeNativeToken(owners[i].address, {
        //     value: ethers.utils.parseEther(PRIZE),
        //   });
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
