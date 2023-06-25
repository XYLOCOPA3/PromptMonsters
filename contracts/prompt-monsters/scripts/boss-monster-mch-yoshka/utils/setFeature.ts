import { BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  // 適宜変更 ------------------------------
  // 日本語
  const languageJp = "日本語";
  const featureJp = "MCH,CryptoWorld,SuperPowerful,GaySlang";
  // English
  const languageEn = "English";
  const featureEn = "MCH,CryptoWorld,SuperPowerful,GaySlang";
  // 適宜変更 ------------------------------

  const addr = BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS;
  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(addr);

  console.log("setFeature -----------------------------");
  console.log("language:", languageJp);
  console.log(
    `Before: ${
      (await bossMonsterMchYoshka.getBossExtension(languageJp)).feature
    }`,
  );
  await (await bossMonsterMchYoshka.setFeature(languageJp, featureJp)).wait();
  console.log(
    `After:  ${
      (await bossMonsterMchYoshka.getBossExtension(languageJp)).feature
    }`,
  );
  console.log("language:", languageEn);
  console.log(
    `Before: ${
      (await bossMonsterMchYoshka.getBossExtension(languageEn)).feature
    }`,
  );
  await (await bossMonsterMchYoshka.setFeature(languageEn, featureEn)).wait();
  console.log(
    `After:  ${
      (await bossMonsterMchYoshka.getBossExtension(languageEn)).feature
    }`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
