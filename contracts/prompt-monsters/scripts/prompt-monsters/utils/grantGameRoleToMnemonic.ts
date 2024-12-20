import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { getWallets } from "../../utils";
import { ethers } from "hardhat";

export async function grantGameRoleToMnemonic() {
  const role = ethers.utils.id("GAME_ROLE");

  const addr = PROMPT_MONSTERS_PROXY_ADDRESS;
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(addr);

  console.log("Before: ");
  const oldRoleMemberCount = await promptMonsters.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await promptMonsters.getRoleMember(role, i));
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
    await (await promptMonsters.grantRole(role, wallets[i].address)).wait();
    console.log(`DONE!!!`);
  }
  // await (
  //   await promptMonsters.grantRole(
  //     role,
  //     "0x2B7c474E24bbE5Ac5695b0bD5dF2615eB007D2b1",
  //   )
  // ).wait();

  console.log("After : ");
  const newRoleMemberCount = await promptMonsters.getRoleMemberCount(role);
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await promptMonsters.getRoleMember(role, i));
  }
}

grantGameRoleToMnemonic().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
