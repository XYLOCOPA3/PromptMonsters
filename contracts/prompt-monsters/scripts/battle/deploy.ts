import {
  BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
} from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Battle Deploy ---------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.deployProxy(
    Battle,
    [PROMPT_MONSTERS_PROXY_ADDRESS, STAMINA_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleProxy.deployed();
  console.log("Deployed BattleProxy address: ", battleProxy.address);
  console.log(
    "Battle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(battleProxy.address),
  );

  console.log("Completed deployment");

  // Wait 10 seconds before verification, because it fails if it is done immediately after deployment
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // console.log("--- Verify ----------------------------------");

  // console.log("Verifying...");

  // try {
  //   await run("verify:verify", {
  //     address: battleProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Battle Deploy -----------------------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- Start set to Stamina --------------------");
  console.log("---------------------------------------------");

  const Stamina = await ethers.getContractFactory("Stamina");

  const stamina = Stamina.attach(BATTLE_PROXY_ADDRESS);

  await (
    await stamina.grantRole(ethers.utils.id("GAME_ROLE"), battleProxy.address)
  ).wait();

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End set to Stamina ----------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
