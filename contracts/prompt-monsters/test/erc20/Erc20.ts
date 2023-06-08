import { deployErc20 } from "./utils/DeployErc20";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Erc20", function () {
  async function init() {
    const { erc20 } = await loadFixture(deployErc20);

    return {
      erc20,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { erc20 } = await loadFixture(init);
      expect(erc20.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });
  });
});
