import {
  BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  BOSS_BATTLE_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

async function setGameRole() {
  console.log("setGameRole -----------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const BossBattleMch1 = await ethers.getContractFactory("TestBBM1");
  const bossBattleMch1Proxy = BossBattleMch1.attach(
    BOSS_BATTLE_MCH_1_PROXY_ADDRESS,
  );

  console.log("Set GAME_ROLE -----------------------------");
  const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  await (
    await bossBattleMch1Proxy.grantRole(role, BOSS_BATTLE_PROXY_ADDRESS)
  ).wait();
}

setGameRole().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
