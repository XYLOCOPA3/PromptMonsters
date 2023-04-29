import {
  PROMPT_MONSTERS_EXTERNAL_LINK,
  PROMPT_MONSTERS_WALLET,
} from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Mock MCH Coin Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20 = await Erc20.deploy();
  await erc20.deployed();
  console.log("Deployed Erc20 address: ", erc20.address);

  console.log("Completed deployment");

  console.log("---------------------------------------------");
  ("---------------------------------------------");
  console.log("--- End erc20 Deploy --------------");
  console.log("---------------------------------------------");
  console.log("---------------------------------------------");
  console.log("--- Start PromptMonsters Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonstersProxy = await upgrades.deployProxy(
    PromptMonsters,
    [
      PROMPT_MONSTERS_EXTERNAL_LINK,
      erc20.address,
      ethers.utils.parseEther("100"),
      PROMPT_MONSTERS_WALLET,
    ],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await promptMonstersProxy.deployed();
  console.log(
    "Deployed PromptMonstersProxy address: ",
    promptMonstersProxy.address,
  );
  console.log(
    "PromptMonsters implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      promptMonstersProxy.address,
    ),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PromptMonsters Deploy --------------");
  console.log("---------------------------------------------");

  console.log("---------------------------------------------");
  console.log("--- Start Battle Deploy ----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  console.log("Deploying contracts with account: ", deployer.address);

  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.deployProxy(Battle, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await battleProxy.deployed();
  console.log("Deployed BattleProxy address: ", battleProxy.address);
  console.log(
    "Battle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(battleProxy.address),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Battle Deploy --------------");
  console.log("---------------------------------------------");
  console.log("---------------------------------------------");
  console.log("--- Start BattleS1 Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  console.log("Deploying contracts with account: ", deployer.address);

  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [battleProxy.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.deployed();
  console.log("Deployed BattleS1Proxy address: ", battleS1Proxy.address);
  console.log(
    "BattleS1 implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(battleS1Proxy.address),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleS1 Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
