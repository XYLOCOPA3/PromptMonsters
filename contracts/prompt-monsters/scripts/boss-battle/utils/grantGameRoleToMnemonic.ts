import { BOSS_BATTLE_PROXY_ADDRESS } from "../../const";
import { getWallets } from "../../utils";
import { ethers } from "hardhat";

export async function grantGameRoleToMnemonic() {
  const addr = BOSS_BATTLE_PROXY_ADDRESS;
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattle = BossBattle.attach(addr);

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
}

grantGameRoleToMnemonic().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
