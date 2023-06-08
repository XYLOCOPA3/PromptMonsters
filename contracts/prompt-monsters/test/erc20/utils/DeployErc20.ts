import { Erc20 } from "../../../typechain-types";
import { ethers, upgrades } from "hardhat";

export async function deployErc20() {
  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20Proxy = await upgrades.deployProxy(Erc20, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await erc20Proxy.deployed();

  const erc20 = Erc20.attach(erc20Proxy.address);

  const args: Erc20Args = {
    erc20,
  };
  return args;
}

export type Erc20Args = {
  erc20: Erc20;
};
