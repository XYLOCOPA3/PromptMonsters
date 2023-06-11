import { deployBossBattle } from "../helpers/Deployment/BossBattle";
import { deployBossBattleMch1 } from "../helpers/Deployment/BossBattleMch1";
import { deployBossMonsterMchYoshka } from "../helpers/Deployment/BossMonsterMchYoshka";
import { deployErc20 } from "../helpers/Deployment/Erc20";
import { deployPromptMonsters } from "../helpers/Deployment/PromptMonsters";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import { deployPromptMonstersImage } from "../helpers/Deployment/PromptMonstersImage";
import { deployPromptMonstersExtension } from "../prompt-monsters-extension/utils/DeployPromptMonstersExtension";

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

  const { promptMonstersImage } = await deployPromptMonstersImage(
    deployer,
    promptMonsters.address,
  );

  await(await promptMonsters.connect(deployer).setPromptMonstersImage(promptMonstersImage.address)).wait();


  const { promptMonstersExtension } = await deployPromptMonstersExtension();

  await(await promptMonstersExtension.grantRole(ethers.utils.id("GAME_ROLE"), promptMonsters.address)).wait();

  await(await promptMonsters.connect(deployer).setPromptMonstersExtension(promptMonstersExtension.address)).wait();


  // BossBattle
  const { bossBattle } = await deployBossBattle(deployer);


  // BossBattleMch1
  const { bossBattleMch1 } = await deployBossBattleMch1(deployer);

  await (
    await bossBattleMch1
      .connect(deployer)
      .grantRole(ethers.utils.id("GAME_ROLE"), bossBattle.address)
  ).wait();

  await(await bossBattle.connect(deployer).addEventKey("MCH")).wait();

  await(await bossBattle.connect(deployer).addBossBattleEvent("MCH", bossBattleMch1.address)).wait();

  
  // BossMonsterMchYoshka
  const { bossMonsterMchYoshka } = await deployBossMonsterMchYoshka(deployer);

  await (
    await bossMonsterMchYoshka
      .connect(deployer)
      .grantRole(ethers.utils.id("GAME_ROLE"), bossBattle.address)
  ).wait();

  await(
    await bossBattleMch1.connect(deployer).setBossMonster(bossMonsterMchYoshka.address)
  ).wait();

  return {
    promptMonsters,
    promptMonstersImage,
    promptMonstersExtension,
    erc20,
    bossBattle,
    bossBattleMch1,
    bossMonsterMchYoshka,
  };
};
