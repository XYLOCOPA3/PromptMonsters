import {
  BOSS_BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../../const";
import { getNowDate } from "../../utils";
import { ethers } from "hardhat";

export async function main() {
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(BOSS_BATTLE_PROXY_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const eventKey = "mch";
  const bbeId = 0;

  console.log("totalBossBattle -----------------------");

  // ミント済みモンスターRPリスト取得
  const totalMonsters = Number(await promptMonsters.getMonstersTotalSupply());
  const tokenIds: number[] = [];
  for (let i = 0; i < totalMonsters; i++) {
    tokenIds.push(i);
  }
  const resurrectionPrompts = await promptMonsters.getResurrectionPrompts(
    tokenIds,
  );

  // 現在時刻（日本標準時刻）
  const [nowJST, formattedDate] = getNowDate();
  console.log(nowJST);

  // 各種データを取得してオブジェクトにまとめる
  const results = await Promise.all([
    bossBattle.getHighScores(eventKey, bbeId, resurrectionPrompts), // ハイスコア一覧を取得
    promptMonsters.getMonsterExtensions(resurrectionPrompts), // ミント済みモンスターリスト取得
  ]);
  const highScores = results[0];
  const monsters = results[1];
  const rankings = highScores.map((highScore, i) => {
    return {
      score: highScore,
      id: i,
      name: monsters[i].name,
      hp: monsters[i].hp,
      atk: monsters[i].atk,
      def: monsters[i].def,
      int: monsters[i].inte,
      mgr: monsters[i].mgr,
      agl: monsters[i].agl,
      skillTypes: monsters[i].skillTypes,
      feature: monsters[i].feature,
      flavor: monsters[i].flavor,
    };
  });

  // ハイスコアを高い順でソート
  rankings.sort((a, b) => {
    return b.score - a.score;
  });

  // 勝率の高い順に表示
  // 各項目の文字数を計算して、項目ごとの開始位置が揃うように表示する
  // No., 勝率, マッチ数, 勝利数, ID, 名前の順に表示
  console.log(`Ranking\t| Score\t| ID\t| Name`);
  rankings.forEach((ranking, i) => {
    console.log(
      `${i + 1}\t| ${ranking.score}\t| ${ranking.id}\t| ${ranking.name}`,
    );
  });

  // csvとして保存
  let csv = `Ranking,Score,ID,Name,HP,ATK,DEF,INT,MGR,AGL,Skill1,Skill2,Skill3,Skill4,Feature,Flavor\n`;
  rankings.forEach((ranking, i) => {
    csv += `"${i + 1}","${ranking.score}","${ranking.id}","${ranking.name}","${
      ranking.hp
    }","${ranking.atk}","${ranking.def}","${ranking.int}","${ranking.mgr}","${
      ranking.agl
    }",${_getSkillTypesStr(ranking.skillTypes)},"${ranking.feature}","${
      ranking.flavor
    }"\n`;
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
  // ファイル名は現在時刻で "YYYYMMDD-HHMMSS" とする
  // 出力先は contracts/prompt-monsters/scripts/boss-battle/utils/total とする
  const filePath = path.join(__dirname, `total/${formattedDate}.csv`);
  fs.writeFileSync(filePath, "\uFEFF" + csv, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const _getSkillTypesStr = (skillTypes: number[]) => {
  if (skillTypes.length === 0) return `"","","",""`;
  const skillTypeStrs = [];
  for (let i = 0; i < skillTypes.length; i++) {
    if (skillTypes[i] === 1) skillTypeStrs.push(`"???"`);
    else if (skillTypes[i] === 100) skillTypeStrs.push(`"物理攻撃"`);
    else if (skillTypes[i] === 101) skillTypeStrs.push(`"特殊攻撃"`);
    else if (skillTypes[i] === 200) skillTypeStrs.push(`"回復"`);
    else skillTypeStrs.push(`"Unknown"`);
    if (i === 3) break;
  }
  let skillTypesStr = skillTypeStrs.join(",");
  if (skillTypes.length === 1) skillTypesStr += `,"","",""`;
  else if (skillTypes.length === 2) skillTypesStr += `,"",""`;
  else if (skillTypes.length === 3) skillTypesStr += `,""`;
  return skillTypesStr;
};
