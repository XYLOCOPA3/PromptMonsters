import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BattleS1 Deploy -------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BattleS1 = await ethers.getContractFactory("TestBS1");
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [PROMPT_MONSTERS_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.deployed();

  const battleS1ImplementationAddress = await upgrades.erc1967.getImplementationAddress(battleS1Proxy.address);
  
  try {
    recordContractsData("BattleS1Proxy", battleS1Proxy.address, deployer.address);
    recordContractsData("BattleS1Implementation", battleS1ImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log("Deployed BattleS1Proxy address: ", battleS1Proxy.address);
  console.log(
    "BattleS1 implementation deployed to:",
    battleS1ImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BattleS1 Deploy ---------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
