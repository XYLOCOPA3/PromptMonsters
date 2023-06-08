import { BOSS_BATTLE_MCH_1_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function dummy() {
  console.log("dummy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattleMch1 = await ethers.getContractFactory("BossBattleMch1");
  const bossBattleMch1Proxy = BossBattleMch1.attach(
    BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  );
}

dummy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
