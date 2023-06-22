import { deployDistributor } from "../helpers/deploy/deployDistributor";
import { deployErc20 } from "../helpers/deploy/deployErc20";
import { postDeployDistributor } from "../helpers/post-deploy/postDeployDistributor";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Distributor", function () {
  async function init() {
    const { distributor } = await loadFixture(deployDistributor);
    const { erc20 } = await loadFixture(deployErc20);
    const [deployer, distributorWallet] = await ethers.getSigners();

    await postDeployDistributor(
      distributor,
      erc20.address,
      distributorWallet.address,
    );

    return {
      distributor,
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

  describe("Main Logic", function () {
    it("distributeNativeToken", async function () {
      // TODO: distributeERC20のテストコードを書く
    });

    it("distributeERC20", async function () {
      // TODO: distributeERC20のテストコードを書く
    });
  });
});
