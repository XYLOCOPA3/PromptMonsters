import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function main() {
  console.log("- setMonsterIdToResurrectionPrompt");
  const monsterId = 25;
  const resurrectionPrompt = ethers.Wallet.createRandom().address;

  const PromptMonsters = await ethers.getContractFactory("TestPM");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const beforeRp = (
    await promptMonsters.getResurrectionPrompts([monsterId])
  )[0];
  console.log("Before: ", beforeRp);
  if (beforeRp !== ethers.constants.AddressZero) {
    console.log(
      "ResurrectionPrompt が既にセットされています。上書きしたい場合はこちらのif分をコメントアウトしてください",
    );
    return;
  }
  await (
    await promptMonsters.setTokenIdToResurrectionPromptMap(
      monsterId,
      resurrectionPrompt,
    )
  ).wait();
  console.log(
    "After : ",
    (await promptMonsters.getResurrectionPrompts([monsterId]))[0],
  );
  console.log("DONE!!!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
