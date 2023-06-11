import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployBossBattleMch1 = async (deployer: SignerWithAddress) => {
  const BossBattleMch1 = await ethers.getContractFactory("TestBBM1");
  const bossBattleMch1Proxy = await upgrades.deployProxy(BossBattleMch1, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await bossBattleMch1Proxy.connect(deployer).deployed();

  const bossBattleMch1 = BossBattleMch1.attach(bossBattleMch1Proxy.address);

  return {
    bossBattleMch1,
  };
};
