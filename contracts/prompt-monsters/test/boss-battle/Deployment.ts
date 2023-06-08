import { deployBossBattle } from "../helpers/Deployment/BossBattle";
import { deployBossBattleMch1 } from "../helpers/Deployment/BossBattleMch1";
import { deployBossMonsterMchYoshka } from "../helpers/Deployment/BossMonsterMchYoshka";
import { deployErc20 } from "../helpers/Deployment/Erc20";
import { deployPromptMonsters } from "../helpers/Deployment/PromptMonsters";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";

export const deploy = async (
  deployer: SignerWithAddress,
  promptMonstersWallet: SignerWithAddress,
) => {
  const { erc20 } = await deployErc20();

  const { promptMonsters } = await deployPromptMonsters(
    deployer,
    erc20,
    promptMonstersWallet,
  );

  const { bossBattle } = await deployBossBattle(deployer);

  const { bossBattleMch1 } = await deployBossBattleMch1(deployer);

  const { bossMonsterMchYoshka } = await deployBossMonsterMchYoshka(deployer);

  // await (
  //   await bossBattle
  //     .connect(deployer)
  //     .setPromptMonstersAddress(promptMonsters.address)
  // ).wait();

  await (
    await bossBattle
      .connect(deployer)
      .grantRole(ethers.utils.id("GAME_ROLE"), promptMonsters.address)
  ).wait();

  // await (
  //   await bossBattle
  //     .connect(deployer)
  //     .addBossBattleEventAddress(bossBattleMch1.address)
  // ).wait();

  // await (await bossBattle.connect(deployer).setIsBossBattleActive(true)).wait();

  // await (
  //   await bossBattleMch1
  //     .connect(deployer)
  //     .setPromptMonstersAddress(promptMonsters.address)
  // ).wait();

  await (
    await bossBattleMch1
      .connect(deployer)
      .grantRole(ethers.utils.id("GAME_ROLE"), bossBattle.address)
  ).wait();

  // await (
  //   await bossBattleMch1
  //     .connect(deployer)
  //     .setBossMonsterAddress(bossMonsterMchYoshka.address)
  // ).wait();

  // await (
  //   await bossBattleMch1.connect(deployer).setIsBossBattleEventActive(true)
  // ).wait();

  return {
    promptMonsters,
    erc20,
    bossBattle,
    bossBattleMch1,
    bossMonsterMchYoshka,
  };
};
