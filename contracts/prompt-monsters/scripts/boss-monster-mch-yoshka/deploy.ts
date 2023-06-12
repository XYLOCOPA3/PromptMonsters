import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossMonsterMchYoshka Deploy -------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshkaProxy = await upgrades.deployProxy(
    BossMonsterMchYoshka,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await bossMonsterMchYoshkaProxy.deployed();

  const bossMonsterMchYoshkaImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    bossMonsterMchYoshkaProxy.address,
  );
  
  try {
    recordContractsData("BossMonsterMchYoshkaProxy", bossMonsterMchYoshkaProxy.address, deployer.address);
    recordContractsData("BossMonsterMchYoshkaImplementation", bossMonsterMchYoshkaImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log(
    "Deployed BossMonsterMchYoshkaProxy address: ",
    bossMonsterMchYoshkaProxy.address,
  );
  console.log(
    "BossMonsterMchYoshka implementation deployed to:",
    bossMonsterMchYoshkaImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossMonsterMchYoshka Deploy ---------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
