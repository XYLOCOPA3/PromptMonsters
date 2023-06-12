import { ethers, upgrades } from "hardhat";

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
    "TestBMMY",
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
  console.log(
    "Deployed BossMonsterMchYoshkaProxy address: ",
    bossMonsterMchYoshkaProxy.address,
  );
  console.log(
    "BossMonsterMchYoshka implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      bossMonsterMchYoshkaProxy.address,
    ),
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
