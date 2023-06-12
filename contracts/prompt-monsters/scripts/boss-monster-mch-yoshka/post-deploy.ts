import { ITestPM } from "../../typechain-types";
import {
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
} from "../const";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossMonsterMchYoshka Post Deploy --");
  console.log("---------------------------------------------");
  console.log("");

  const languageEn = "English";
  const languageJp = "日本語";
  const bossEn: ITestPM.MonsterStruct = {
    feature: "MCH, Raid, Enemy",
    name: "Yoshka",
    flavor:
      "A super powerful enemy among those who gather data in the Cryptoworld. It speaks in gay slang.",
    skills: [
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
    ],
    lv: 1,
    hp: 30,
    atk: 12,
    def: 18,
    inte: 14,
    mgr: 10,
    agl: 10,
  };
  const bossJp: ITestPM.MonsterStruct = {
    feature: "MCH, Raid, Enemy",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。",
    skills: [
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
    101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101,
    101, 101, 101, 101, 100, 100, 100, 100, 100, 100, 100, 100, 100, 101, 101,
    101, 101, 100, 1, 101, 101, 100, 101, 101, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    101, 101, 1, 1, 1, 1, 1, 1, 1, 101, 200, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  console.log("--- Post Deploy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "TestBMMY",
  );
  const bossMonsterMchYoshkaProxy = BossMonsterMchYoshka.attach(
    BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS,
  );

  console.log("addLanguage -----------------------------");
  console.log(`Before: ${await bossMonsterMchYoshkaProxy.getLanguages()}`);
  await (await bossMonsterMchYoshkaProxy.addLanguage(languageEn)).wait();
  await (await bossMonsterMchYoshkaProxy.addLanguage(languageJp)).wait();
  console.log(`After : ${await bossMonsterMchYoshkaProxy.getLanguages()}`);

  console.log("setBoss -----------------------------");
  console.log(languageEn);
  console.log(
    `Before: ${await bossMonsterMchYoshkaProxy.getBossExtension(languageEn)}`,
  );
  await (await bossMonsterMchYoshkaProxy.setBoss(languageEn, bossEn)).wait();
  await (
    await bossMonsterMchYoshkaProxy.setSkillTypes(bossEn.skills, _skillTypes)
  ).wait();
  console.log(
    `After : ${await bossMonsterMchYoshkaProxy.getBossExtension(languageEn)}`,
  );
  console.log(languageJp);
  console.log(
    `Before: ${await bossMonsterMchYoshkaProxy.getBossExtension(languageJp)}`,
  );
  await (await bossMonsterMchYoshkaProxy.setBoss(languageJp, bossJp)).wait();
  await (
    await bossMonsterMchYoshkaProxy.setSkillTypes(bossJp.skills, _skillTypes)
  ).wait();
  console.log(
    `After : ${await bossMonsterMchYoshkaProxy.getBossExtension(languageJp)}`,
  );

  console.log("Set GAME_ROLE -----------------------------");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  await (
    await bossMonsterMchYoshkaProxy.grantRole(role, BOSS_BATTLE_PROXY_ADDRESS)
  ).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossMonsterMchYoshka Post Deploy ----");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
