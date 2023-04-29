import { BATTLE_PROXY_ADDRESS, STAMINA_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("Stamina");

  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);

  console.log(`Address: ${BATTLE_PROXY_ADDRESS}`);

  console.log("Before: ");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  const oldRoleMemberCount = await stamina.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await stamina.getRoleMember(role, i));
  }
  await (await stamina.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();
  console.log("After : ");
  const newRoleMemberCount = await stamina.getRoleMemberCount(role);
  for (let i = 0; i < Number(newRoleMemberCount); i++) {
    console.log(await stamina.getRoleMember(role, i));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
