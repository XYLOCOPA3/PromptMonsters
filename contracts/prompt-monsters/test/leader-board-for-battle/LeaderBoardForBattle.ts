import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LeaderBoardForBattle", function () {
  async function init() {
    const { leaderBoardForBattle, s1forBattle } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    return {
      leaderBoardForBattle,
      s1forBattle,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { leaderBoardForBattle, s1forBattle, deployer, user1 } =
        await loadFixture(init);

      expect(leaderBoardForBattle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(s1forBattle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });

    it("S1ForBattle: leaderBoardForBattle Address", async function () {
      const { leaderBoardForBattle, s1forBattle } = await loadFixture(init);

      expect(
        await s1forBattle.getRoleMember(ethers.constants.HashZero, 0),
      ).to.equal(leaderBoardForBattle.address);
    });

    it("S1ForBattle: getMatchCount", async function () {
      const { leaderBoardForBattle, s1forBattle } = await loadFixture(init);

      expect(await s1forBattle.getMatchCount(0)).to.equal(0);
    });

    it("S1ForBattle: getWinCount", async function () {
      const { leaderBoardForBattle, s1forBattle } = await loadFixture(init);

      expect(await s1forBattle.getWinCount(0)).to.equal(0);
    });

    // it("S1ForBattle: getBattleData", async function () {
    //   const { leaderBoardForBattle, s1forBattle } = await loadFixture(init);

    //   expect(await s1forBattle.getBattleData(0));
    // });

    it("S1ForBattle: getBattleIdList", async function () {
      const { leaderBoardForBattle, s1forBattle } = await loadFixture(init);

      expect(await s1forBattle.getBattleIdList(0)).to.deep.equal([]);
    });
  });

  describe("LeaderBoardForBattle", function () {
    it("addSeasonBattleData", async function () {
      const { leaderBoardForBattle, s1forBattle, deployer, user1 } =
        await loadFixture(init);

      expect(
        await leaderBoardForBattle.setSeasonForBattleAddress(
          s1forBattle.address,
        ),
      ).not.to.be.reverted;

      expect(await leaderBoardForBattle.getSeasonMatchCount(0, 0)).to.equal(0);
      expect(await leaderBoardForBattle.getSeasonMatchCount(0, 1)).to.equal(0);

      expect(await leaderBoardForBattle.getSeasonWinCount(0, 0)).to.equal(0);
      expect(await leaderBoardForBattle.getSeasonWinCount(0, 1)).to.equal(0);

      expect(
        await leaderBoardForBattle.getSeasonBattleIdList(0, 0),
      ).to.deep.equal([]);
      expect(
        await leaderBoardForBattle.getSeasonBattleIdList(0, 1),
      ).to.deep.equal([]);

      const battleLog =
        "闇に潜むグルームブルームが現れた。ユニコーンドラゴンは聖なる炎を放ち、光の爪で攻撃する。グルームブルームは影の一撃で反撃し、夜の視線でユニコーンドラゴンを苦しめた。しかし、ユニコーンドラゴンは天空の咆哮でグルームブルームを吹き飛ばした。";

      // addSeasonBattleData
      expect(await leaderBoardForBattle.addSeasonBattleData(0, 0, 1, battleLog))
        .not.to.be.reverted;

      expect(await leaderBoardForBattle.getSeasonMatchCount(0, 0)).to.equal(1);
      expect(await leaderBoardForBattle.getSeasonMatchCount(0, 1)).to.equal(1);

      expect(await leaderBoardForBattle.getSeasonWinCount(0, 0)).to.equal(1);
      expect(await leaderBoardForBattle.getSeasonWinCount(0, 1)).to.equal(0);

      expect(
        await leaderBoardForBattle.getSeasonBattleIdList(0, 0),
      ).to.deep.equal([0]);
      expect(
        await leaderBoardForBattle.getSeasonBattleIdList(0, 1),
      ).to.deep.equal([0]);

      let seasonBattleData = await leaderBoardForBattle.getSeasonBattleData(
        0,
        0,
      );

      expect(seasonBattleData[0].timestamp).not.to.equal(0);
      expect(seasonBattleData[0].battleLog).to.equal(battleLog);

      seasonBattleData = await leaderBoardForBattle.getSeasonBattleData(0, 1);

      expect(seasonBattleData[0].timestamp).not.to.equal(0);
      expect(seasonBattleData[0].battleLog).to.equal(battleLog);
    });
  });
});
