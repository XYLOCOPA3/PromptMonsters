import {
  PROMPT_MONSTERS_PROXY_ADDRESS,
  DISTRIBUTOR_PROXY_ADDRESS,
} from "../const";
import {
  FIRST_PRIZE,
  SECOND_PRIZE,
  THIRD_PRIZE,
  FOURTH_PRIZE,
  SIXTH_PRIZE,
  SEVENTH_PRIZE,
  TENTH_PRIZE,
  ELEVENTH_PRIZE,
  FIFTIETH_PRIZE,
  FIFTY_FIRST_PRIZE,
  HUNDREDTH_PRIZE,
  FIRST_PRIZE_REWARD,
  SECOND_PRIZE_REWARD,
  THIRD_PRIZE_REWARD,
  FROM_4TH_TO_6TH_PRIZE_REWARD,
  FROM_7TH_TO_10TH_PRIZE_REWARD,
  FROM_11TH_TO_50TH_PRIZE_REWARD,
  FROM_51TH_TO_100TH_PRIZE_REWARD,
} from "./const";
import { readFileSync } from "fs";
import { ethers } from "hardhat";

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(DISTRIBUTOR_PROXY_ADDRESS);

  const From11To50: any[] = [];

  const From51To100: any[] = [];

  const startBlockHeight = 21342235;
  const endBlockHeight = 22542235;

  console.log("");
  console.log(
    "---------------------------------- get monster ID per ranking position ---------------------------------------",
  );

  const csv = readFileSync(`scripts/battle/total/20230601-003759.csv`, {
    encoding: "utf8",
  });
  const CSV = require("comma-separated-values");
  const rowList = new CSV(csv, { header: true, cast: false }).parse();
  var rankingMonsterIDs = [];
  for (var i = 0; i < 100; i++) {
    rankingMonsterIDs.push(rowList[i].ID);
  }
  console.log(rankingMonsterIDs);

  console.log("");
  console.log(
    "---------------------------------- get owner's address for minted 940 monsters ------------------------------",
  );

  const createLogsTmp1 = await promptMonsters.queryFilter(
    promptMonsters.filters.MintedMonster(null, null, null),
    startBlockHeight,
    startBlockHeight + 1200000, //for 本番 on mchMainnet
    // startBlockHeight + 16200000, //for test on mumbai
  );

  if (createLogsTmp1.length === 0) return;

  const mintedOwners: (any | any)[][] = [];

  for (var i = 0; i < createLogsTmp1.length; i++) {
    mintedOwners.push([
      createLogsTmp1[i].args.newTokenId.toString(),
      createLogsTmp1[i].args.tokenOwner,
    ]);
    const t = await createLogsTmp1[i].getBlock();
  }

  console.log("");
  console.log(
    "---------------------------------- get transferred monster ID -------------------------------------------------",
  );

  const transferredMonsterID: (any | any)[][] = [];

  const createLogsTmp = await promptMonsters.queryFilter(
    promptMonsters.filters.Transfer(null, null, null),
    startBlockHeight,
    endBlockHeight,
  );

  if (createLogsTmp.length === 0) return;

  for (let i = 0; i < createLogsTmp.length; i++) {
    if (
      createLogsTmp[i].args.from !==
      "0x0000000000000000000000000000000000000000"
    ) {
      transferredMonsterID.push([
        createLogsTmp[i].args.tokenId.toString(),
        createLogsTmp[i].args.from,
        createLogsTmp[i].args.to,
      ]);
    }
    const t = await createLogsTmp[i].getBlock();
  }
  for (var i = 0; i < transferredMonsterID.length; i++) {
    console.log(
      transferredMonsterID[i][0] +
        ", " +
        transferredMonsterID[i][1] +
        ", " +
        transferredMonsterID[i][2],
    );
  }

  console.log("");
  console.log(
    "---------------------------------- get unique transferred monster ID -------------------------------------------",
  );

  function removeDuplicate(array: any[][]): any[][] {
    const uniqueArray = array.reduceRight((acc, subArray) => {
      const key = subArray[0];
      if (!acc.some((item) => item[0] === key)) {
        acc.unshift(subArray);
      }
      return acc;
    }, []);

    return uniqueArray;
  }

  const uniqueTransferredMonsterID = removeDuplicate(transferredMonsterID);

  for (var i = 0; i < uniqueTransferredMonsterID.length; i++) {
    console.log(
      uniqueTransferredMonsterID[i][0] +
        ", " +
        uniqueTransferredMonsterID[i][1] +
        ", " +
        uniqueTransferredMonsterID[i][2],
    );
  }

  console.log("");
  console.log(
    "---------------------------------- make and initialize owners array at 23:59 on May 31 -----------------------",
  );

  var isPassed: boolean;
  const ownersAtTheTimeOnMay31: (any | any)[][] = [];

  for (var i = 0; i < 100; i++) {
    isPassed = false;
    const rankingMSID = rankingMonsterIDs[i];
    for (var j = 0; j < uniqueTransferredMonsterID.length; j++) {
      if (rankingMSID == uniqueTransferredMonsterID[j][0]) {
        isPassed = true;
        console.log("Passed: " + rankingMSID);
        ownersAtTheTimeOnMay31.push([
          rankingMSID,
          uniqueTransferredMonsterID[j][2],
        ]);
        break;
      }
    }
    if (!isPassed) {
      ownersAtTheTimeOnMay31.push([rankingMSID, mintedOwners[rankingMSID][1]]);
    }
  }

  for (var i = 0; i < 100; i++) {
    console.log(
      ownersAtTheTimeOnMay31[i][0] + ", " + ownersAtTheTimeOnMay31[i][1],
    );
  }

  console.log("");
  console.log(
    "---------------------------------- execute distribution for ranking rewards ----------------------------------",
  );

  for (var i = 0; i < 100; i++) {
    var reward: string = "0";
    if (i === FIRST_PRIZE) {
      reward = FIRST_PRIZE_REWARD;
    } else if (i === SECOND_PRIZE) {
      reward = SECOND_PRIZE_REWARD;
    } else if (i === THIRD_PRIZE) {
      reward = THIRD_PRIZE_REWARD;
    } else if (FOURTH_PRIZE <= i && i <= SIXTH_PRIZE) {
      reward = FROM_4TH_TO_6TH_PRIZE_REWARD;
    } else if (SEVENTH_PRIZE <= i && i <= TENTH_PRIZE) {
      reward = FROM_7TH_TO_10TH_PRIZE_REWARD;
    } else if (ELEVENTH_PRIZE <= i && i <= FIFTIETH_PRIZE) {
      reward = FROM_11TH_TO_50TH_PRIZE_REWARD;
    } else if (FIFTY_FIRST_PRIZE <= i && i <= HUNDREDTH_PRIZE) {
      reward = FROM_51TH_TO_100TH_PRIZE_REWARD;
    }
    const prize = await distributor
      .connect(from)
      .distributeNativeToken(ownersAtTheTimeOnMay31[i][1], {
        value: ethers.utils.parseEther(reward),
      });
  }

  console.log("");
  console.log(
    "---------------------------------- ALL Done! -------------------------------------------------------------------",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
