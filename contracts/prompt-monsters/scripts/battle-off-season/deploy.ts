import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleOffSeason Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeasonProxy = await upgrades.deployProxy(
    BattleOffSeason,
    [PROMPT_MONSTERS_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleOffSeasonProxy.deployed();

  const battleOffSeasonImplementationAddress = await upgrades.erc1967.getImplementationAddress(battleOffSeasonProxy.address)
  
  try {
    recordContractsData("BattleOffSeasonProxy", battleOffSeasonProxy.address, deployer.address);
    recordContractsData("BattleOffSeasonImplementation", battleOffSeasonImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log(
    "Deployed BattleOffSeasonProxy address: ",
    battleOffSeasonProxy.address,
  );
  console.log(
    "BattleOffSeason implementation deployed to:",
    battleOffSeasonImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleOffSeason Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
