import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Distributor", function () {
  async function init() {
    const { distributor, promptMonsters, erc20 } = await loadFixture(deploy);
    const [deployer, user1, resurrectionPrompt1, resurrectionPrompt2] =
      await ethers.getSigners();
    expect(
      await distributor.grantRole(
        ethers.utils.id("DISTRIBUTOR_ROLE"),
        deployer.address,
      ),
    ).not.to.be.reverted;
    expect(
      await erc20
        .connect(deployer)
        .transfer(deployer.address, ethers.utils.parseEther("10000")),
    ).not.to.be.reverted;
    return {
      distributor,
      promptMonsters,
      erc20,
      deployer,
      user1,
      resurrectionPrompt1,
      resurrectionPrompt2,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { distributor } = await loadFixture(init);
      expect(distributor.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });
  });

  describe("Set ERC20 token address", function () {
    it("setERC20Address", async function () {
      const { distributor, deployer, erc20 } = await loadFixture(init);
      expect(await distributor.getERC20Address()).to.equal(
        "0x0000000000000000000000000000000000000000",
      );
      await expect(distributor.connect(deployer).setERC20Address(erc20.address))
        .not.to.be.reverted;
      expect(await distributor.getERC20Address()).to.equal(erc20.address);
    });
  });

  describe("distribute Native Token", function () {
    it("distributeNativeToken", async function () {
      const { distributor, deployer } = await loadFixture(init);
      await expect(
        distributor
          .connect(deployer)
          .distributeNativeToken("0x4833C2fB6F00787c7F5f60a7F1a8aD9e191648C8", {
            value: ethers.utils.parseEther("0.01"),
          }),
      ).not.to.be.reverted;
    });
  });

  describe("distribute ERC20", function () {
    it("distributeERC20", async function () {
      const { distributor, deployer } = await loadFixture(init);
      await expect(
        distributor
          .connect(deployer)
          .distributeERC20(
            "0x4833C2fB6F00787c7F5f60a7F1a8aD9e191648C8",
            ethers.utils.parseEther("1"),
          ),
      ).not.to.be.reverted;
    });
  });
});
