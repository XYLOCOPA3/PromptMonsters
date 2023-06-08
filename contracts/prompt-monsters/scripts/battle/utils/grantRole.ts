import { BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Battle = await ethers.getContractFactory("Battle");

  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);

  console.log(`Address: ${BATTLE_PROXY_ADDRESS}`);

  console.log("Before: ");
  const role = ethers.utils.hexZeroPad("0x00", 32);
  const oldRoleMemberCount = await battle.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await battle.getRoleMember(role, i));
  }
  await (await battle.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();
  console.log("After : ");
  const newRoleMemberCount = await battle.getRoleMemberCount(role);
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await battle.getRoleMember(role, i));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
