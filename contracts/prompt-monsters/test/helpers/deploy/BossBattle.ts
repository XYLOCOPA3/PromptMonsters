import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployBossBattle = async (deployer: SignerWithAddress) => {
  const BossBattle = await ethers.getContractFactory("BossBattle");
  const bossBattleProxy = await upgrades.deployProxy(BossBattle, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await bossBattleProxy.connect(deployer).deployed();

  const bossBattle = BossBattle.attach(bossBattleProxy.address);

  return {
    bossBattle,
  };
};
