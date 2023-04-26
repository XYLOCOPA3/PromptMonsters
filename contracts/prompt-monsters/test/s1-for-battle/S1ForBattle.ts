import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("S1ForBattle", function () {
  async function init() {
    const { s1ForBattle, leaderBoardForBattle } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    return {
      leaderBoardForBattle,
      s1ForBattle,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { leaderBoardForBattle, s1ForBattle, deployer, user1 } =
        await loadFixture(init);

      expect(leaderBoardForBattle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(s1ForBattle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });

    it("S1ForBattle: leaderBoardForBattle Address", async function () {
      const { leaderBoardForBattle, s1ForBattle } = await loadFixture(init);

      expect(
        await s1ForBattle.getRoleMember(ethers.constants.HashZero, 0),
      ).to.equal(leaderBoardForBattle.address);
    });

    it("S1ForBattle: getMatchCount", async function () {
      const { leaderBoardForBattle, s1ForBattle } = await loadFixture(init);

      expect(await s1ForBattle.getMatchCount(0)).to.equal(0);
    });

    it("S1ForBattle: getWinCount", async function () {
      const { leaderBoardForBattle, s1ForBattle } = await loadFixture(init);

      expect(await s1ForBattle.getWinCount(0)).to.equal(0);
    });

    // it("S1ForBattle: getBattleData", async function () {
    //   const { leaderBoardForBattle, s1ForBattle } = await loadFixture(init);

    //   expect(await s1ForBattle.getBattleData(0));
    // });

    it("S1ForBattle: getBattleIdList", async function () {
      const { leaderBoardForBattle, s1ForBattle } = await loadFixture(init);

      expect(await s1ForBattle.getBattleIdList(0)).to.deep.equal([]);
    });
  });
});
