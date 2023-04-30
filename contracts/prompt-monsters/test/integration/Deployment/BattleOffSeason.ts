import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployBattleOffSeason = async (
  deployer: SignerWithAddress,
  promptMonstersAddress: string,
) => {
  const BattleOffSeason = await ethers.getContractFactory("BattleOffSeason");
  const battleOffSeasonProxy = await upgrades.deployProxy(
    BattleOffSeason,
    [promptMonstersAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleOffSeasonProxy.connect(deployer).deployed();

  const battleOffSeason = BattleOffSeason.attach(battleOffSeasonProxy.address);

  return {
    battleOffSeason,
  };
};
