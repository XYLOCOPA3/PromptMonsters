import {
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
} from "../../../scripts/const";
import { ethers, upgrades } from "hardhat";

export async function deployBattleS1() {
  const Battle = await ethers.getContractFactory("TestB");
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
  const BattleS1 = await ethers.getContractFactory("TestBS1");
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [PROMPT_MONSTERS_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.deployed();

  const battleS1 = BattleS1.attach(battleS1Proxy.address);

  return {
    battleS1,
    battle,
  };
}
