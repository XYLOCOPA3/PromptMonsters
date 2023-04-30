import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployStamina = async (
  deployer: SignerWithAddress,
  promptMonstersAddress: string,
) => {
  const Stamina = await ethers.getContractFactory("Stamina");
  const staminaProxy = await upgrades.deployProxy(
    Stamina,
    [promptMonstersAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await staminaProxy.connect(deployer).deployed();

  const stamina = Stamina.attach(staminaProxy.address);

  return {
    stamina,
  };
};
