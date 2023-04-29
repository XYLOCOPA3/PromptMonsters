import {
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
} from "../../../scripts/const";
import { ethers, upgrades } from "hardhat";

export async function deployBattleOffSeason() {
  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.deployProxy(
    Battle,
    [PROMPT_MONSTERS_PROXY_ADDRESS, STAMINA_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleProxy.deployed();

  const battle = Battle.attach(battleProxy.address);
  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeasonProxy = await upgrades.deployProxy(
    BattleOffSeason,
    [PROMPT_MONSTERS_PROXY_ADDRESS, battle.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleOffSeasonProxy.deployed();

  const battleOffSeason = BattleOffSeason.attach(battleOffSeasonProxy.address);

  return {
    battleOffSeason,
    battle,
  };
}
