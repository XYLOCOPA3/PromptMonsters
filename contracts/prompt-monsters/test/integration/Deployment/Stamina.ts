import { ethers, upgrades } from "hardhat";

export const deployStamina = async () => {
  const [deployer] = await ethers.getSigners();
  const Stamina = await ethers.getContractFactory("Stamina");
  const staminaProxy = await upgrades.deployProxy(Stamina, [deployer.address], {
    kind: "uups",
    initializer: "initialize",
  });
  await staminaProxy.deployed();

  const stamina = Stamina.attach(staminaProxy.address);

  return {
    stamina,
  };
};
