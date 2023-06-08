import { ethers, upgrades } from "hardhat";

export const deployErc20 = async () => {
  const [deployer] = await ethers.getSigners();
  const Erc20 = await ethers.getContractFactory("Erc20");
  const erc20Proxy = await upgrades.deployProxy(Erc20, [], {
    kind: "uups",
    initializer: "initialize",
  });
  await erc20Proxy.deployed();
  const erc20 = Erc20.attach(erc20Proxy.address);
  await (
    await erc20.mint(deployer.address, ethers.utils.parseEther("1000000000"))
  ).wait();

  return { erc20 };
};
