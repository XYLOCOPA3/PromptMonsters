import { PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const role = ethers.utils.id("GAME_ROLE");

  const PromptMonstersExtension = await ethers.getContractFactory(
    "PromptMonstersExtension",
  );
  const promptMonstersExtension = PromptMonstersExtension.attach(
    PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  );
  const PromptMonstersImage = await ethers.getContractFactory(
    "PromptMonstersImage",
  );
  const promptMonstersImage = PromptMonstersImage.attach(
    PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  );

  console.log("promptMonstersExtension: -------------------");
  let oldRoleMemberCount = await promptMonstersExtension.getRoleMemberCount(
    role,
  );
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await promptMonstersExtension.getRoleMember(role, i));
  }
  console.log("promptMonstersImage: -------------------");
  oldRoleMemberCount = await promptMonstersImage.getRoleMemberCount(role);
  for (let i = 0; i < Number(oldRoleMemberCount); i++) {
    console.log(await promptMonstersImage.getRoleMember(role, i));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
