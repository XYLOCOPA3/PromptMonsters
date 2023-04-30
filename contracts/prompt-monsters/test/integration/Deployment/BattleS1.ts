import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployBattleS1 = async (
  deployer: SignerWithAddress,
  promptMonstersAddress: string,
) => {
  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battleS1Proxy = await upgrades.deployProxy(
    BattleS1,
    [promptMonstersAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleS1Proxy.connect(deployer).deployed();

  const battleS1 = BattleS1.attach(battleS1Proxy.address);

  return {
    battleS1,
  };
};
