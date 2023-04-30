import { deployBattle } from "./Battle";
import { deployBattleOffSeason } from "./BattleOffSeason";
import { deployBattleS1 } from "./BattleS1";
import { deployErc20 } from "./Erc20";
import { deployPromptMonsters } from "./PromptMonsters";
import { deployStamina } from "./Stamina";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

export const deploy = async (
  deployer: SignerWithAddress,
  promptMonstersWallet: SignerWithAddress,
) => {
  const { erc20 } = await deployErc20(deployer);

  const { promptMonsters } = await deployPromptMonsters(
    deployer,
    erc20,
    promptMonstersWallet,
  );

  const { stamina } = await deployStamina(deployer, promptMonsters.address);

  const { battle } = await deployBattle(
    deployer,
    promptMonsters.address,
    stamina.address,
  );

  (
    await stamina.grantRole(ethers.utils.id("GAME_ROLE"), battle.address)
  ).wait();

  const { battleOffSeason } = await deployBattleOffSeason(
    deployer,
    promptMonsters.address,
  );

  await battleOffSeason.grantRole(ethers.utils.id("GAME_ROLE"), battle.address);

  await battle.addBattleSeasonAddress(battleOffSeason.address);

  const { battleS1 } = await deployBattleS1(deployer, promptMonsters.address);

  await battleS1.grantRole(ethers.utils.id("GAME_ROLE"), battle.address);

  await battle.addBattleSeasonAddress(battleS1.address);

  return {
    promptMonsters,
    erc20,
    stamina,
    battle,
    battleOffSeason,
    battleS1,
  };
};
