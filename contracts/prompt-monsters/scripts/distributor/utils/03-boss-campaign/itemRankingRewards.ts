import {
  PROMPT_MONSTERS_PROXY_ADDRESS,
  PROMPT_MONSTERS_ITEM_PROXY_ADDRESS,
} from "../../../const";
import { readFileSync } from "fs";
import { ethers } from "hardhat";

const PROMPT_MONSTERS_DEPLOY_BH = 21342235;
const PROMPT_MONSTERS_LAST_MINTED_BH = 24002182;
const RANKING_STD = 100;

const FIRST_PRIZE = 0;
const SECOND_PRIZE = 1;
const THIRD_PRIZE = 2;
const FOURTH_PRIZE = 3;
const SIXTH_PRIZE = 5;
const SEVENTH_PRIZE = 6;
const TENTH_PRIZE = 9;
const ELEVENTH_PRIZE = 10;
const FIFTIETH_PRIZE = 49;
const FIFTY_FIRST_PRIZE = 50;
const HUNDREDTH_PRIZE = 99;

const FIRST_PRIZE_REWARD = 20;
const SECOND_PRIZE_REWARD = 12;
const THIRD_PRIZE_REWARD = 8;
const FROM_4TH_TO_6TH_PRIZE_REWARD = 5;
const FROM_7TH_TO_10TH_PRIZE_REWARD = 5;
const FROM_11TH_TO_50TH_PRIZE_REWARD = 2;
const FROM_51TH_TO_100TH_PRIZE_REWARD = 1;

const PRIZE_ITEM_ID = 0;

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const PromptMonstersItem = await ethers.getContractFactory(
    "PromptMonstersItem",
  );
  const promptMonstersItem = PromptMonstersItem.attach(
    PROMPT_MONSTERS_ITEM_PROXY_ADDRESS,
  );

  console.log(
    "-------------------- get monster ID per ranking position --------------------",
  );

  const csv = readFileSync(
    "scripts/boss-battle/utils/total/20230626-044931.csv",
    {
      encoding: "utf8",
    },
  );
  const CSV = require("comma-separated-values");
  const rowList = new CSV(csv, { header: true, cast: false }).parse();
  let rankingMonsterIDs: number[] = [];
  for (let i = 0; i < RANKING_STD; i++) {
    rankingMonsterIDs.push(rowList[i].ID);
  }
  console.log(rankingMonsterIDs);

  console.log("-------------------- get owner's address --------------------");

  const startBlockHeight = PROMPT_MONSTERS_DEPLOY_BH;
  const endBlockHeight = PROMPT_MONSTERS_LAST_MINTED_BH;
  const transferEvents = await promptMonsters.queryFilter(
    promptMonsters.filters.Transfer(null, null, null),
    startBlockHeight,
    endBlockHeight,
  );

  if (transferEvents.length === 0) {
    console.error(`Transferイベントが見つかりませんでした。`);
    return;
  }

  const owners: { address: string; tokenId: string }[] = [];
  let cnt = 0;
  for (let i = 0; i < transferEvents.length; i++) {
    if (transferEvents[i].args.from === ethers.constants.AddressZero) {
      owners.push({
        address: transferEvents[i].args.to,
        tokenId: transferEvents[i].args.tokenId.toString(),
      });
      console.log(owners[cnt].tokenId, owners[cnt].address);
      cnt++;
      continue;
    }
    const tokenId = Number(transferEvents[i].args.tokenId);
    owners[tokenId].address = transferEvents[i].args.to;
    console.log("Transfer!", owners[tokenId].tokenId, owners[tokenId].address);
  }

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
      for (let i = 0; i < RANKING_STD; i++) {
        let reward: number = 0;
        if (i === FIRST_PRIZE) reward = FIRST_PRIZE_REWARD;
        else if (i === SECOND_PRIZE) reward = SECOND_PRIZE_REWARD;
        else if (i === THIRD_PRIZE) reward = THIRD_PRIZE_REWARD;
        else if (FOURTH_PRIZE <= i && i <= SIXTH_PRIZE)
          reward = FROM_4TH_TO_6TH_PRIZE_REWARD;
        else if (SEVENTH_PRIZE <= i && i <= TENTH_PRIZE)
          reward = FROM_7TH_TO_10TH_PRIZE_REWARD;
        else if (ELEVENTH_PRIZE <= i && i <= FIFTIETH_PRIZE)
          reward = FROM_11TH_TO_50TH_PRIZE_REWARD;
        else if (FIFTY_FIRST_PRIZE <= i && i <= HUNDREDTH_PRIZE)
          reward = FROM_51TH_TO_100TH_PRIZE_REWARD;
        for (let j = 0; j < reward; j++) {
          console.log(
            i + 1,
            j + 1,
            owners[rankingMonsterIDs[i]].tokenId,
            owners[rankingMonsterIDs[i]].address,
          );
          //   await (
          //     await promptMonstersItem
          //       .connect(from)
          //       .mintOnlyGameRole(
          //         owners[rankingMonsterIDs[i]].address,
          //         PRIZE_ITEM_ID,
          //       )
          //   ).wait();
        }
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
