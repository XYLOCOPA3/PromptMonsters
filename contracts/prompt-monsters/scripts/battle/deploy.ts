import { PROMPT_MONSTERS_PROXY_ADDRESS, STAMINA_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Battle Deploy ---------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Battle = await ethers.getContractFactory("TestB");
  const battleProxy = await upgrades.deployProxy(
    Battle,
    [PROMPT_MONSTERS_PROXY_ADDRESS, STAMINA_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleProxy.deployed();
  
  try {
    recordContractsData("BattleProxy", battleProxy.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log("Deployed BattleProxy address: ", battleProxy.address);
  console.log(
    "Battle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(battleProxy.address),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Battle Deploy -----------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
