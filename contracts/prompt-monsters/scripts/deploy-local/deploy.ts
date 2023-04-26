import { PROMPT_MONSTERS_EXTERNAL_LINK } from "../const";
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
  console.log("--- Start LeaderBoardForBattle Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  console.log("Deploying contracts with account: ", deployer.address);

  const LeaderBoardForBattle = await ethers.getContractFactory(
    "LeaderBoardForBattle",
  );
  const leaderBoardForBattleProxy = await upgrades.deployProxy(
    LeaderBoardForBattle,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await leaderBoardForBattleProxy.deployed();
  console.log(
    "Deployed LeaderBoardForBattleProxy address: ",
    leaderBoardForBattleProxy.address,
  );
  console.log(
    "LeaderBoardForBattle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      leaderBoardForBattleProxy.address,
    ),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End LeaderBoardForBattle Deploy --------------");
  console.log("---------------------------------------------");
  console.log("---------------------------------------------");
  console.log("--- Start S1ForBattle Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  console.log("Deploying contracts with account: ", deployer.address);

  const S1ForBattle = await ethers.getContractFactory("S1ForBattle");
  const s1ForBattleProxy = await upgrades.deployProxy(
    S1ForBattle,
    [leaderBoardForBattleProxy.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await s1ForBattleProxy.deployed();
  console.log("Deployed S1ForBattleProxy address: ", s1ForBattleProxy.address);
  console.log(
    "S1ForBattle implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(s1ForBattleProxy.address),
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End S1ForBattle Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
