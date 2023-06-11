import { BOSS_BATTLE_PROXY_ADDRESS } from "../../const";
import { ethers } from "hardhat";

async function dummy() {
  console.log("dummy -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattle = await ethers.getContractFactory("TestBB");
  const bossBattleProxy = BossBattle.attach(BOSS_BATTLE_PROXY_ADDRESS);
}

dummy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
