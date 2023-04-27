import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BattleS1", function () {
  async function init() {
    const { battleS1, battleLeaderBoard } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    return {
      battleLeaderBoard,
      battleS1,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { battleLeaderBoard, battleS1 } = await loadFixture(init);

      expect(battleLeaderBoard.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(battleS1.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });

    it("BattleS1: BattleLeaderBoard Address", async function () {
      const { battleLeaderBoard, battleS1 } = await loadFixture(init);

      expect(
        await battleS1.getRoleMember(ethers.constants.HashZero, 0),
      ).to.equal(battleLeaderBoard.address);
    });

    it("BattleS1: getMatchCount", async function () {
      const { battleS1 } = await loadFixture(init);

      expect(await battleS1.getMatchCount(0)).to.equal(0);
    });

    it("BattleS1: getWinCount", async function () {
      const { battleS1 } = await loadFixture(init);

      expect(await battleS1.getWinCount(0)).to.equal(0);
    });

    // it("BattleS1: getBattleData", async function () {
    //   const { battleS1 } = await loadFixture(init);

    //   expect(await battleS1.getBattleData(0));
    // });

    it("BattleS1: getBattleIdList", async function () {
      const { battleS1 } = await loadFixture(init);

      expect(await battleS1.getBattleIdList(0)).to.deep.equal([]);
    });
  });
});
