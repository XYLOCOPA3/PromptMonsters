import { PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS } from "../../const";
import { getWallets } from "../../utils";
import { ethers } from "hardhat";

export async function grantGameRoleToMnemonic() {
  const role = ethers.utils.id("GAME_ROLE");

  const addr = PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS;
  const PromptMonstersExtension = await ethers.getContractFactory(
    "PromptMonstersExtension",
  );
  const promptMonstersExtension = PromptMonstersExtension.attach(addr);

  console.log("Before: ");
  const oldRoleMemberCount = await promptMonstersExtension.getRoleMemberCount(
    role,
  );
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await promptMonstersExtension.getRoleMember(role, i));
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
    await (
      await promptMonstersExtension.grantRole(role, wallets[i].address)
    ).wait();
    console.log(`DONE!!!`);
  }

  console.log("After : ");
  const newRoleMemberCount = await promptMonstersExtension.getRoleMemberCount(
    role,
  );
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await promptMonstersExtension.getRoleMember(role, i));
  }
}

grantGameRoleToMnemonic().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
