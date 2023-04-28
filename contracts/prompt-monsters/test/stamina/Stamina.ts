import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Stamina", function () {
  async function init() {
    const { stamina } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    return {
      stamina,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { stamina, deployer, user1 } = await loadFixture(init);

      expect(stamina.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });
  });
});
