import { IPromptMonsters } from "../../typechain-types";
import {
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  const languageEn = "English";
  const languageJp = "日本語";
  const bossEn: IPromptMonsters.MonsterStruct = {
    feature: "MCH, Raid, Enemy",
    name: "Yoshka",
    flavor:
      "A super powerful enemy among those who gather data in the Cryptoworld. It speaks in gay slang.",
    skills: [
      // 一撃必殺 --------------------------------------------
      "Digital Apocalypse",
      "Digital Black Hole",
      "Data Explosion",
      "Infinity Coding",
      "Digital Nova",
      "Digital Disaster",
      "Data Destroyer",
      "Crypto Shard Storm",
      "Disk of Oblivion",
      "Digital Starlight",
      // 強攻撃 --------------------------------------------
      "Data Storm",
      "System Crash",
      "Virus Bamboo",
      "Crypto Flare",
      "Digital Divide",
      "Digital Burst",
      "Data Strike",
      "Malware Meteor",
      "Binary Barrage",
      "Close-Sole",
      // 攻撃 --------------------------------------------
      "Data Knock",
      "Bug Finger",
      "Software Scratch",
      "Code Whip",
      "Bit Hammer",
      "Data Slash",
      "Virus Kiss",
      "Malware Punch",
      "Error Eye Beam",
      "Binary Breeze",
      // カウンター --------------------------------------------
      "Digital Reflector",
      "Data Deflect",
      "Bug Bounce",
      "System Swap",
      "Malware Mirror Reflect",
      "Code Counter",
      "Network Knockback",
      "Crypto Counter Crash",
      "Cyber Savvy Counter",
      "Fragment Flip-Flop",
      // バフ --------------------------------------------
      "System Stabilizer",
      "Virus Veil",
      "Code Conditioner",
      "Network Node Boost",
      "Data Doping",
      "Network Nitro",
      "Binary Booster",
      "System Supercharge",
      "Data Drive",
      "Crypto Boost",
      // デバフ --------------------------------------------
      "Digital Virus",
      "Crypto Disruption",
      "Slow Data",
      "Data Blockade",
      "System Slump",
      "Digital Freeze",
      "Critical Debuff",
      "Network Noise",
      "Digital Drag",
      "Digital Malware",
      // 防御 --------------------------------------------
      "Data Defense",
      "Bug Barrier",
      "Binary Barrier",
      "Cyber Shield",
      "Glitch Guard",
      "Fragment Fortress",
      "Glitch Guardian",
      "Cyber Surfer Shield",
      "System Shield",
      "Digital Dam",
      // 回復 --------------------------------------------
      "Blockchain Revitalize",
      "Double Signature Recovery",
      "Crypto Heartbeat",
      "Bitcoin Breath",
      "Hash Power Heal",
      "Deep Web Regeneration",
      "Data-driven Repair",
      "Transaction Touch",
      "Private Key Cure",
      "Digital Diamond Defense",
    ],
    lv: 1,
    hp: 30,
    atk: 12,
    def: 18,
    inte: 14,
    mgr: 10,
    agl: 10,
  };
  const bossJp: IPromptMonsters.MonsterStruct = {
    feature: "MCH, Raid, Enemy",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。",
    skills: [
      // 一撃必殺 --------------------------------------------
      "デジタルアポカリプス",
      "デジタルブラックホール",
      "データエクスプロージョン",
      "インフィニティコーディング",
      "デジタルノヴァ",
      "デジタルディザスター",
      "データデストロイヤー",
      "クリプトシャードストーム",
      "ディスクオブリビオン",
      "デジタルスターライト",
      // 強攻撃 --------------------------------------------
      "データストーム",
      "システムクラッシュ",
      "ウイルスバンブー",
      "クリプトフレア",
      "デジタルディバイド",
      "デジタルバースト",
      "データストライク",
      "マルウェアメテオ",
      "バイナリバラージ",
      "クローソール",
      // 攻撃 --------------------------------------------
      "データノック",
      "バグフィンガー",
      "ソフトウェアスクラッチ",
      "コードウィップ",
      "ビットハンマー",
      "データスラッシュ",
      "ウイルスキス",
      "マルウェアパンチ",
      "エラーアイビーム",
      "バイナリブリーズ",
      // カウンター --------------------------------------------
      "デジタルリフレクター",
      "データデフレクト",
      "バグバウンス",
      "システムスワップ",
      "マルウェアミラーリフレクト",
      "コードカウンター",
      "ネットワークノックバック",
      "クリプトカウンタークラッシュ",
      "サイバーサヴァイカウンター",
      "フラグメントフリップフロップ",
      // バフ --------------------------------------------
      "システムスタビライザー",
      "ウイルスヴェール",
      "コードコンディショナー",
      "ネットワークノードブースト",
      "データドーピング",
      "ネットワークニトロ",
      "バイナリブースター",
      "システムスーパーチャージ",
      "データドライブ",
      "クリプトブースト",
      // デバフ --------------------------------------------
      "デジタルウィルス",
      "クリプトディスラプション",
      "スローデータ",
      "データ封鎖",
      "システムスランプ",
      "デジタルフリーズ",
      "クリティカルデバフ",
      "ネットワークノイズ",
      "デジタルドラッグ",
      "デジタルマルウェア",
      // 防御 --------------------------------------------
      "データディフェンス",
      "バグバリア",
      "バイナリバリア",
      "サイバーシールド",
      "グリッチガード",
      "フラグメントフォートレス",
      "グリッチガーディアン",
      "サイバーサーファーシールド",
      "システムシールド",
      "デジタルダム",
      // 回復 --------------------------------------------
      "ブロックチェインリビタライズ",
      "ダブルシグネチャーリカバリー",
      "クリプトハートビート",
      "ビットコインブレス",
      "ハッシュパワーヒール",
      "ディープウェブリジェネレーション",
      "データドリヴンリペア",
      "トランザクションタッチ",
      "プライヴェートキーキュア",
      "デジタルダイヤモンドデフェンス",
    ],
    lv: 1,
    hp: 30,
    atk: 12,
    def: 18,
    inte: 14,
    mgr: 10,
    agl: 10,
  };
  const _skillTypes = [
    // 一撃必殺 --------------------------------------------
    101, 101, 101, 101, 101, 101, 101, 101, 101, 101,
    // 強攻撃 --------------------------------------------
    101, 101, 101, 101, 101, 101, 101, 101, 101, 100,
    // 攻撃 --------------------------------------------
    100, 100, 100, 100, 100, 100, 100, 100, 101, 101,
    // カウンター --------------------------------------------
    101, 101, 100, 1, 101, 101, 100, 101, 101, 1,
    // バフ --------------------------------------------
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // デバフ --------------------------------------------
    101, 101, 1, 1, 1, 1, 1, 1, 1, 101,
    // 防御 --------------------------------------------
    200, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // 回復 --------------------------------------------
    200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  ];

  const role = ethers.utils.id("GAME_ROLE");

  console.log("---------------------------------------------");
  console.log("--- Start BossMonsterMchYoshka Post Deploy --");
  console.log("---------------------------------------------");
  console.log("");

  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;
  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(addr);

  console.log("addLanguage -----------------------------");
  console.log(`Before: ${await bossMonsterMchYoshka.getLanguages()}`);
  await (await bossMonsterMchYoshka.addLanguage(languageEn)).wait();
  await (await bossMonsterMchYoshka.addLanguage(languageJp)).wait();
  console.log(`After : ${await bossMonsterMchYoshka.getLanguages()}`);

  console.log("setBoss -----------------------------");
  console.log(languageEn);
  console.log(
    `Before: ${await bossMonsterMchYoshka.getBossExtension(languageEn)}`,
  );
  await (await bossMonsterMchYoshka.setBoss(languageEn, bossEn)).wait();
  await (
    await bossMonsterMchYoshka.setSkillTypes(bossEn.skills, _skillTypes)
  ).wait();
  console.log(
    `After : ${await bossMonsterMchYoshka.getBossExtension(languageEn)}`,
  );
  console.log(languageJp);
  console.log(
    `Before: ${await bossMonsterMchYoshka.getBossExtension(languageJp)}`,
  );
  await (await bossMonsterMchYoshka.setBoss(languageJp, bossJp)).wait();
  await (
    await bossMonsterMchYoshka.setSkillTypes(bossJp.skills, _skillTypes)
  ).wait();
  console.log(
    `After : ${await bossMonsterMchYoshka.getBossExtension(languageJp)}`,
  );

  console.log("Set GAME_ROLE -----------------------------");
  await (
    await bossMonsterMchYoshka.grantRole(role, BOSS_BATTLE_PROXY_ADDRESS)
  ).wait();

  console.log("setPromptMonsters -----------------------------");
  console.log(`Before: ${await bossMonsterMchYoshka.getPromptMonsters()}`);
  await (
    await bossMonsterMchYoshka.setPromptMonsters(PROMPT_MONSTERS_PROXY_ADDRESS)
  ).wait();
  console.log(`After:  ${await bossMonsterMchYoshka.getPromptMonsters()}`);

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossMonsterMchYoshka Post Deploy ----");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
