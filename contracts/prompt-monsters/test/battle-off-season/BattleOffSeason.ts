import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BattleOffSeason", function () {
  async function init() {
    const { battleOffSeason, battleLeaderBoard } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    return {
      battleLeaderBoard,
      battleOffSeason,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { battleLeaderBoard, battleOffSeason } = await loadFixture(init);

      expect(battleLeaderBoard.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(battleOffSeason.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });

    it("BattleOffSeason: BattleLeaderBoard Address", async function () {
      const { battleLeaderBoard, battleOffSeason } = await loadFixture(init);

      expect(
        await battleOffSeason.getRoleMember(ethers.constants.HashZero, 0),
      ).to.equal(battleLeaderBoard.address);
    });

    it("BattleOffSeason: getMatchCount", async function () {
      const { battleOffSeason } = await loadFixture(init);

      expect(await battleOffSeason.getMatchCount(0)).to.equal(0);
    });

    it("BattleOffSeason: getWinCount", async function () {
      const { battleOffSeason } = await loadFixture(init);

      expect(await battleOffSeason.getWinCount(0)).to.equal(0);
    });

    // it("BattleOffSeason: getBattleData", async function () {
    //   const { battleOffSeason } = await loadFixture(init);

    //   expect(await battleOffSeason.getBattleData(0));
    // });

    it("BattleOffSeason: getBattleIdList", async function () {
      const { battleOffSeason } = await loadFixture(init);

      expect(await battleOffSeason.getBattleIdList(0)).to.deep.equal([]);
    });
  });
});
