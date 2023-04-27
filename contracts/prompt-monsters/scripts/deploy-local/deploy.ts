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

  const MCHCoin = await ethers.getContractFactory("MCHCoin");
  const mchCoin = await MCHCoin.deploy();
  await mchCoin.deployed();
  console.log("Deployed MCHCoin address: ", mchCoin.address);

  console.log("Completed deployment");

  console.log("---------------------------------------------");
  ("---------------------------------------------");
  console.log("--- End mchCoin Deploy --------------");
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
      mchCoin.address,
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
  console.log("--- Start BattleLeaderBoard Deploy ----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  console.log("Deploying contracts with account: ", deployer.address);

  const BattleLeaderBoard = await ethers.getContractFactory(
    "BattleLeaderBoard",
  );
  const battleLeaderBoardProxy = await upgrades.deployProxy(
    BattleLeaderBoard,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleLeaderBoardProxy.deployed();
  console.log(
    "Deployed BattleLeaderBoardProxy address: ",
    battleLeaderBoardProxy.address,
  );
  console.log(
    "BattleLeaderBoard implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      battleLeaderBoardProxy.address,
    ),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleLeaderBoard Deploy --------------");
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
    [battleLeaderBoardProxy.address],
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
