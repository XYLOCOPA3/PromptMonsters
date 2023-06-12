import { ethers, upgrades } from "hardhat";
import { recordContractsData } from "../helpers/recordContractsData";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start BossBattleMch1 Deploy -------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattleMch1 = await ethers.getContractFactory("TestBBM1");
  const bossBattleMch1Proxy = await upgrades.deployProxy(BossBattleMch1, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await bossBattleMch1Proxy.deployed();

  const bossBattleMch1ImplementationAddress = await upgrades.erc1967.getImplementationAddress(bossBattleMch1Proxy.address,);
  
  try {
    recordContractsData("BossBattleMch1Proxy", bossBattleMch1Proxy.address, deployer.address);
    recordContractsData("BossBattleMch1Implementation", bossBattleMch1ImplementationAddress, deployer.address);
    console.log("Recorded contract data");
  } catch (e) {
    console.log(e);
  }

  console.log(
    "Deployed BossBattleMch1Proxy address: ",
    bossBattleMch1Proxy.address,
  );
  console.log(
    "BossBattleMch1 implementation deployed to:",
    bossBattleMch1ImplementationAddress,
  );

  console.log("Completed deployment");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End BossBattleMch1 Deploy ---------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
