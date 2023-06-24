import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployBossMonsterMchYoshka = async (
  deployer: SignerWithAddress,
) => {
  const BossMonsterMchYoshka = await ethers.getContractFactory(
    "BossMonsterMchYoshka",
  );
  const bossMonsterMchYoshkaProxy = await upgrades.deployProxy(
    BossMonsterMchYoshka,
    [],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await bossMonsterMchYoshkaProxy.connect(deployer).deployed();

  const bossMonsterMchYoshka = BossMonsterMchYoshka.attach(
    bossMonsterMchYoshkaProxy.address,
  );

  return {
    bossMonsterMchYoshka,
  };
};
