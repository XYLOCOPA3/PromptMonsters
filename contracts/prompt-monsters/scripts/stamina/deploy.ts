import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Stamina Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Stamina = await ethers.getContractFactory("Stamina");
  const staminaProxy = await upgrades.deployProxy(
    Stamina,
    [PROMPT_MONSTERS_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await staminaProxy.deployed();
  console.log("Deployed StaminaProxy address: ", staminaProxy.address);
  console.log(
    "Stamina implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(staminaProxy.address),
  );

  console.log("Completed deployment");

  // Wait 10 seconds before verification, because it fails if it is done immediately after deployment
  // console.log("Waiting for 10 seconds before verification...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // console.log("--- Verify ----------------------------------");

  // console.log("Verifying...");

  // try {
  //   await run("verify:verify", {
  //     address: staminaProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  // console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Stamina Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
