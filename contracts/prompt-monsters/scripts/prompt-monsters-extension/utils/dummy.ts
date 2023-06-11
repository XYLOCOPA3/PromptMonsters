import { PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function dummy() {
  console.log("dummy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PromptMonstersExtension = await ethers.getContractFactory(
    "TestPME",
  );
  const promptMonstersExtension = PromptMonstersExtension.attach(
    PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS,
  );
}

dummy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
