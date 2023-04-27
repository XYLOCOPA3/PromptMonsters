import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BattleLeaderBoard", function () {
  async function init() {
    const { battleLeaderBoard, s1forBattle } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    return {
      battleLeaderBoard,
      s1forBattle,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { battleLeaderBoard, s1forBattle, deployer, user1 } =
        await loadFixture(init);

      expect(battleLeaderBoard.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(s1forBattle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });

    it("BattleS1: BattleLeaderBoard Address", async function () {
      const { battleLeaderBoard, s1forBattle } = await loadFixture(init);

      expect(
        await s1forBattle.getRoleMember(ethers.constants.HashZero, 0),
      ).to.equal(battleLeaderBoard.address);
    });

    it("BattleS1: getMatchCount", async function () {
      const { battleLeaderBoard, s1forBattle } = await loadFixture(init);

      expect(await s1forBattle.getMatchCount(0)).to.equal(0);
    });

    it("BattleS1: getWinCount", async function () {
      const { battleLeaderBoard, s1forBattle } = await loadFixture(init);

      expect(await s1forBattle.getWinCount(0)).to.equal(0);
    });

    // it("BattleS1: getBattleDataByMonsterId", async function () {
    //   const { battleLeaderBoard, s1forBattle } = await loadFixture(init);

    //   expect(await s1forBattle.getBattleDataByMonsterId(0));
    // });

    it("BattleS1: getBattleIdList", async function () {
      const { s1forBattle } = await loadFixture(init);

      expect(await s1forBattle.getBattleIdList(0)).to.deep.equal([]);
    });
  });

  describe("BattleLeaderBoard", function () {
    it("addBattleSeasonData", async function () {
      const { battleLeaderBoard, s1forBattle } = await loadFixture(init);

      expect(
        await battleLeaderBoard.addBattleSeasonAddress(s1forBattle.address),
      ).not.to.be.reverted;

      expect(await battleLeaderBoard.getSeasonMatchCount(0, 0)).to.equal(0);
      expect(await battleLeaderBoard.getSeasonMatchCount(0, 1)).to.equal(0);

      expect(await battleLeaderBoard.getSeasonWinCount(0, 0)).to.equal(0);
      expect(await battleLeaderBoard.getSeasonWinCount(0, 1)).to.equal(0);

      expect(await battleLeaderBoard.getSeasonBattleIdList(0, 0)).to.deep.equal(
        [],
      );
      expect(await battleLeaderBoard.getSeasonBattleIdList(0, 1)).to.deep.equal(
        [],
      );

      const battleLog =
        "闇に潜むグルームブルームが現れた。ユニコーンドラゴンは聖なる炎を放ち、光の爪で攻撃する。グルームブルームは影の一撃で反撃し、夜の視線でユニコーンドラゴンを苦しめた。しかし、ユニコーンドラゴンは天空の咆哮でグルームブルームを吹き飛ばした。";

      // addBattleSeasonData
      expect(await battleLeaderBoard.addBattleSeasonData(0, 0, 1, battleLog))
        .not.to.be.reverted;

      expect(await battleLeaderBoard.getSeasonMatchCount(0, 0)).to.equal(1);
      expect(await battleLeaderBoard.getSeasonMatchCount(0, 1)).to.equal(1);

      expect(await battleLeaderBoard.getSeasonWinCount(0, 0)).to.equal(1);
      expect(await battleLeaderBoard.getSeasonWinCount(0, 1)).to.equal(0);

      expect(await battleLeaderBoard.getSeasonBattleIdList(0, 0)).to.deep.equal(
        [0],
      );
      expect(await battleLeaderBoard.getSeasonBattleIdList(0, 1)).to.deep.equal(
        [0],
      );

      let battleSeasonData =
        await battleLeaderBoard.getBattleSeasonDataByMonsterId(0, 0);

      expect(battleSeasonData[0].timestamp).not.to.equal(0);
      expect(battleSeasonData[0].battleLog).to.equal(battleLog);

      battleSeasonData = await battleLeaderBoard.getBattleSeasonDataByMonsterId(
        0,
        1,
      );

      expect(battleSeasonData[0].timestamp).not.to.equal(0);
      expect(battleSeasonData[0].battleLog).to.equal(battleLog);
    });
  });
});
