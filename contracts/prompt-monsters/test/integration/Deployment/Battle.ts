import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";

export const deployBattle = async (
  deployer: SignerWithAddress,
  promptMonstersAddress: string,
  staminaAddress: string,
) => {
  const Battle = await ethers.getContractFactory("Battle");
  const battleProxy = await upgrades.deployProxy(
    Battle,
    [promptMonstersAddress, staminaAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await battleProxy.connect(deployer).deployed();

  const battle = Battle.attach(battleProxy.address);

  return {
    battle,
  };
};
