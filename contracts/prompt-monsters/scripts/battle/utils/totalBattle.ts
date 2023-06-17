import {
  BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");
  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const Battle = await ethers.getContractFactory("Battle");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);
  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battles1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);

  const seasonId = 1;

  // 現在時刻（日本標準時刻）
  // フォーマットは YYYYMMDD-HHMMSS とする
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");
  const formattedDate = `${year}${month}${day}-${hour}${minute}${second}`;
  console.log(formattedDate);
  const nowJST = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  // 全モンスターのIDを取得
  const totalMonsterCount = (
    await promptMonsters.getMonstersTotalSupply()
  ).toNumber();
  const monsterIds = [];
  for (let i = 0; i < totalMonsterCount; i++) {
    monsterIds.push(i);
  }
  console.log(`totalMonsterCount: ${totalMonsterCount}`);

  // 全モンスター情報を取得
  const resurrectionPrompts = await promptMonsters.getResurrectionPrompts(
    monsterIds,
  );
  const monsters = await promptMonsters.getMonsterExtensions(
    resurrectionPrompts,
  );

  // 各モンスターの総マッチ数、勝ち数を取得
  const battleResults = await Promise.all([
    battle.getBatchSeasonMatchCount(seasonId, monsterIds),
    battle.getBatchSeasonWinCount(seasonId, monsterIds),
  ]);
  const totalMatchCounts = battleResults[0];
  const totalWinCounts = battleResults[1];

  // 各モンスターの総マッチ数からマッチ数の総数を計算して表示
  const totalMatchCount = totalMatchCounts.reduce(
    (prev, current) => prev + current.toNumber(),
    0,
  );
  console.log(`totalMatchCount: ${totalMatchCount}`);

  // `totalMatchCounts` と `totalWinCounts` から各モンスターの勝率を計算して表示
  // 勝率は win*1 - lose*1 で計算
  // モンスターIDとモンスター名とマッチ数と勝利数と勝率をオブジェクトに格納
  const winRates = totalMatchCounts.map((matchCount, i) => {
    const winCount = totalWinCounts[i].toNumber();
    const loseCount = matchCount.toNumber() - winCount;
    return {
      monsterId: i,
      monsterName: monsters[i].name,
      flavor: monsters[i].flavor,
      matchCount: matchCount.toNumber(),
      winCount: winCount,
      winRate: winCount * 1 - loseCount * 1,
    };
  });

  // マッチ数順でソート
  winRates.sort((a, b) => b.matchCount - a.matchCount);
  // 勝率の高い順でソート
  winRates.sort((a, b) => b.winRate - a.winRate);

  // 勝率の高い順に表示
  // 各項目の文字数を計算して、項目ごとの開始位置が揃うように表示する
  // No., 勝率, マッチ数, 勝利数, ID, 名前の順に表示
  console.log(`No.\t| 勝率\t| マッチ数\t| 勝利数\t| ID\t| 名前`);
  winRates.forEach((winRate, i) => {
    console.log(
      `${i + 1}\t| ${winRate.winRate}\t| ${winRate.matchCount}\t\t| ${
        winRate.winCount
      }\t\t| ${winRate.monsterId}\t| ${winRate.monsterName}`,
    );
  });

  // winRates をcsvで出力
  // 1行目は "No., WinRate, MatchCount, WinCount, ID, Name, Time" とする
  // 2行目以降は各モンスターの情報をカンマ区切りで出力する
  // 1行目の文字数を計算して、各項目の開始位置が揃うように出力する
  let csv = `No.,WinRate,MatchCount,WinCount,ID,Name,flavor,Time\n`;
  winRates.forEach((winRate, i) => {
    csv += `"${i + 1}","${winRate.winRate}","${winRate.matchCount}","${
      winRate.winCount
    }","${winRate.monsterId}","${winRate.monsterName}","${
      winRate.flavor
    }","${nowJST}"\n`;
  });

  // "total" ディレクトリがなければ作成する
  const fs = require("fs");
  const path = require("path");
  const dirPath = path.join(__dirname, "total");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  // csvをファイルに出力
  // BOM付きUTF-8で出力する
  // ファイル名は現在時刻で "YYYY-MMDD-HHMMSS" とする
  // 出力先は contracts/prompt-monsters/scripts/total とする
  const filePath = path.join(
    __dirname,
    `total/${formattedDate.replace(/\//g, "-").replace(/:/g, "")}.csv`,
  );
  fs.writeFileSync(filePath, "\uFEFF" + csv, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
