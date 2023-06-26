import {
  BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  BOSS_BATTLE_PROXY_ADDRESS,
  BOSS_MINT_PRICE,
  BOSS_MONSTER_MCH_YOSHKA_WALLET,
  ERC20_ADDRESS,
} from "../const";
import { getWallets } from "../utils";
import console from "console";
import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattle Post Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  const eventKey = "mch";
  const eventAddress = BOSS_BATTLE_MCH_1_PROXY_ADDRESS;

  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(addr);

  console.log("addEventKey -----------------------------");
  console.log(`Before: ${await bossBattle.getEventKeys()}`);
  await (await bossBattle.addEventKey(eventKey)).wait();
  console.log(`After : ${await bossBattle.getEventKeys()}`);

  console.log("addBossBattleEvent -----------------------------");
  console.log(`Before: ${await bossBattle.getBossBattleEvents()}`);
  await (await bossBattle.addBossBattleEvent(eventKey, eventAddress)).wait();
  console.log(`After : ${await bossBattle.getBossBattleEvents()}`);

  console.log("setErc20 -----------------------------");
  console.log(`Before: ${await bossBattle.getErc20()}`);
  await (await bossBattle.setErc20(ERC20_ADDRESS)).wait();
  console.log(`After:  ${await bossBattle.getErc20()}`);

  console.log("addBossMonsterWallet -----------------------------");
  console.log(`Before: ${await bossBattle.getBossMonsterWallets(eventKey)}`);
  await (
    await bossBattle.addBossMonsterWallet(
      eventKey,
      BOSS_MONSTER_MCH_YOSHKA_WALLET,
    )
  ).wait();
  console.log(`After:  ${await bossBattle.getBossMonsterWallets(eventKey)}`);

  console.log("setMintPrice -----------------------------");
  console.log(`Before: ${await bossBattle.getMintPrice()}`);
  await (await bossBattle.setMintPrice(BOSS_MINT_PRICE)).wait();
  console.log(`After:  ${await bossBattle.getMintPrice()}`);

  console.log("grantGameRoleToMnemonic -----------------------------");
  const role = ethers.utils.id("GAME_ROLE");

  console.log("Before: ");
  const oldRoleMemberCount = await bossBattle.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await bossBattle.getRoleMember(role, i));
  }

  const cnt = 100;
  const wallets = await getWallets(cnt);
  for (let i = 0; i < wallets.length; i++) {
    console.log(
      `wallet ${
        i + 1
      } -------------------------------------------------------------`,
    );
    console.log(`address: ${wallets[i].address}`);
    await (await bossBattle.grantRole(role, wallets[i].address)).wait();
    console.log(`DONE!!!`);
  }

  console.log("After : ");
  const newRoleMemberCount = await bossBattle.getRoleMemberCount(role);
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await bossBattle.getRoleMember(role, i));
  }

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattle Post Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
