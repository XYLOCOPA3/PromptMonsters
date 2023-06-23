import { BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  const languageEn = "English";
  const skillsEn = [
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
  ];
  const languageJp = "日本語";
  const skillsJp = [
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
  ];
  const skillsTypes = [
    // 回復 --------------------------------------------
    200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  ];
  // 適宜変更 ------------------------------

  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;
  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(addr);
  const log = [
    "--- 一撃必殺 --------------------------------------------",
    "--- 強攻撃 --------------------------------------------",
    "--- 攻撃 --------------------------------------------",
    "--- カウンター --------------------------------------------",
    "--- バフ --------------------------------------------",
    "--- デバフ --------------------------------------------",
    "--- 防御 --------------------------------------------",
    "--- 回復 --------------------------------------------",
  ];

  console.log("addSkills -----------------------------");
  // 日本語 ------------------------------------------
  console.log(languageJp);
  const befBossJp = await bossMonsterMchYoshka.getBossExtension(languageJp);
  console.log("Before:");
  for (let i = 0; i < befBossJp.skills.length; i++) {
    if (i % 10 === 0) console.log(log[Math.floor(i / 10)]);
    console.log(befBossJp.skillTypes[i], befBossJp.skills[i]);
  }
  await (await bossMonsterMchYoshka.addSkills(languageJp, skillsJp)).wait();
  await (
    await bossMonsterMchYoshka.setSkillTypes(skillsJp, skillsTypes)
  ).wait();
  const aftBossJp = await bossMonsterMchYoshka.getBossExtension(languageJp);
  console.log("After:");
  for (let i = 0; i < aftBossJp.skills.length; i++) {
    if (i % 10 === 0) console.log(log[Math.floor(i / 10)]);
    console.log(aftBossJp.skillTypes[i], aftBossJp.skills[i]);
  }
  // English ------------------------------------------
  console.log(languageEn);
  const befBossEn = await bossMonsterMchYoshka.getBossExtension(languageEn);
  console.log("Before:");
  for (let i = 0; i < befBossEn.skills.length; i++) {
    if (i % 10 === 0) console.log(log[Math.floor(i / 10)]);
    console.log(befBossEn.skillTypes[i], befBossEn.skills[i]);
  }
  await (await bossMonsterMchYoshka.addSkills(languageEn, skillsEn)).wait();
  await (
    await bossMonsterMchYoshka.setSkillTypes(skillsEn, skillsTypes)
  ).wait();
  const aftBossEn = await bossMonsterMchYoshka.getBossExtension(languageEn);
  console.log("After:");
  for (let i = 0; i < aftBossEn.skills.length; i++) {
    if (i % 10 === 0) console.log(log[Math.floor(i / 10)]);
    console.log(aftBossEn.skillTypes[i], aftBossEn.skills[i]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
