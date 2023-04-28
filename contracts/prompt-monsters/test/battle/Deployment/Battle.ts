import { STAMINA_PROXY_ADDRESS } from "../../../scripts/const";
import { deployPromptMonsters } from "./PromptMonsters";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";

export async function deployBattle() {
  const { promptMonsters, erc20 } = await loadFixture(deployPromptMonsters);

  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.deployProxy(
    Battle,
    [promptMonsters.address, STAMINA_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleProxy.deployed();

  const battle = Battle.attach(battleProxy.address);

  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [promptMonsters.address, battle.address],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.deployed();

  const battleS1 = BattleS1.attach(battleS1Proxy.address);

  return {
    promptMonsters,
    erc20,
    battle,
    battleS1,
  };
}
