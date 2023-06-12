import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattle Deploy -----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattle = await ethers.getContractFactory("TestBB");
  const bossBattleProxy = await upgrades.deployProxy(BossBattle, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await bossBattleProxy.deployed();

  const bossBattleImplementationAddress = await upgrades.erc1967.getImplementationAddress(bossBattleProxy.address);
  
  try {
    recordContractsData("BossBattleProxy", bossBattleProxy.address, deployer.address);
    recordContractsData("BossBattleImplementation", bossBattleImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log("Deployed BossBattleProxy address: ", bossBattleProxy.address);
  console.log(
    "BossBattle implementation deployed to:",
    bossBattleImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattle Deploy -------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
