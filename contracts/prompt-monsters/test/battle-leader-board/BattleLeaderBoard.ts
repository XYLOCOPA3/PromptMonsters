import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BattleLeaderBoard", function () {
  async function init() {
    const { battleLeaderBoard, battleS1 } = await loadFixture(deploy);

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
      const { battleLeaderBoard, battleS1, deployer, user1 } =
        await loadFixture(init);

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
      const { battleLeaderBoard, battleS1 } = await loadFixture(init);

      expect(await battleS1.getMatchCount(0)).to.equal(0);
    });

    it("BattleS1: getWinCount", async function () {
      const { battleLeaderBoard, battleS1 } = await loadFixture(init);

      expect(await battleS1.getWinCount(0)).to.equal(0);
    });

    // it("BattleS1: getBattleDataByMonsterId", async function () {
    //   const { battleLeaderBoard, battleS1 } = await loadFixture(init);

    //   expect(await battleS1.getBattleDataByMonsterId(0));
    // });

    it("BattleS1: getBattleIdList", async function () {
      const { battleS1 } = await loadFixture(init);

      expect(await battleS1.getBattleIdList(0)).to.deep.equal([]);
    });
  });

  describe("BattleLeaderBoard", function () {
    it("addSeasonBattleData", async function () {
      const { battleLeaderBoard, battleS1 } = await loadFixture(init);

      expect(await battleLeaderBoard.addBattleSeasonAddress(battleS1.address))
        .not.to.be.reverted;

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

      // addSeasonBattleData
      expect(await battleLeaderBoard.addSeasonBattleData(0, 0, 1, battleLog))
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

      let seasonBattleDataByMonsterId =
        await battleLeaderBoard.getSeasonBattleDataByMonsterId(0, 0);

      expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
      expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
      expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
      expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);

      seasonBattleDataByMonsterId =
        await battleLeaderBoard.getSeasonBattleDataByMonsterId(0, 1);

      expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
      expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
      expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
      expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);

      let seasonBattleData = await battleLeaderBoard.getSeasonBattleData(0);
      expect(seasonBattleData.length).to.equal(1);
      expect(seasonBattleData[0].timestamp).not.to.equal(0);
      expect(seasonBattleData[0].winMonsterId).to.equal(0);
      expect(seasonBattleData[0].loseMonsterId).to.equal(1);
      expect(seasonBattleData[0].battleLog).to.equal(battleLog);
    });

    it("addSeasonBattleData twice", async function () {
      const { battleLeaderBoard, battleS1 } = await loadFixture(init);

      expect(await battleLeaderBoard.addBattleSeasonAddress(battleS1.address))
        .not.to.be.reverted;

      const battleLog =
        "闇に潜むグルームブルームが現れた。ユニコーンドラゴンは聖なる炎を放ち、光の爪で攻撃する。グルームブルームは影の一撃で反撃し、夜の視線でユニコーンドラゴンを苦しめた。しかし、ユニコーンドラゴンは天空の咆哮でグルームブルームを吹き飛ばした。";

      // addSeasonBattleData
      expect(await battleLeaderBoard.addSeasonBattleData(0, 0, 1, battleLog))
        .not.to.be.reverted;
      expect(await battleLeaderBoard.addSeasonBattleData(0, 0, 1, battleLog))
        .not.to.be.reverted;

      expect(await battleLeaderBoard.getSeasonMatchCount(0, 0)).to.equal(2);
      expect(await battleLeaderBoard.getSeasonMatchCount(0, 1)).to.equal(2);

      expect(await battleLeaderBoard.getSeasonWinCount(0, 0)).to.equal(2);
      expect(await battleLeaderBoard.getSeasonWinCount(0, 1)).to.equal(0);

      expect(await battleLeaderBoard.getSeasonBattleIdList(0, 0)).to.deep.equal(
        [0, 1],
      );
      expect(await battleLeaderBoard.getSeasonBattleIdList(0, 1)).to.deep.equal(
        [0, 1],
      );

      let seasonBattleDataByMonsterId =
        await battleLeaderBoard.getSeasonBattleDataByMonsterId(0, 0);

      expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
      expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
      expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
      expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
      expect(seasonBattleDataByMonsterId[1].timestamp).not.to.equal(0);
      expect(seasonBattleDataByMonsterId[1].winMonsterId).to.equal(0);
      expect(seasonBattleDataByMonsterId[1].loseMonsterId).to.equal(1);
      expect(seasonBattleDataByMonsterId[1].battleLog).to.equal(battleLog);

      seasonBattleDataByMonsterId =
        await battleLeaderBoard.getSeasonBattleDataByMonsterId(0, 1);

      expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
      expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
      expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
      expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
      expect(seasonBattleDataByMonsterId[1].timestamp).not.to.equal(0);
      expect(seasonBattleDataByMonsterId[1].winMonsterId).to.equal(0);
      expect(seasonBattleDataByMonsterId[1].loseMonsterId).to.equal(1);
      expect(seasonBattleDataByMonsterId[1].battleLog).to.equal(battleLog);

      let seasonBattleData = await battleLeaderBoard.getSeasonBattleData(0);
      expect(seasonBattleData.length).to.equal(2);
      expect(seasonBattleData[0].timestamp).not.to.equal(0);
      expect(seasonBattleData[0].winMonsterId).to.equal(0);
      expect(seasonBattleData[0].loseMonsterId).to.equal(1);
      expect(seasonBattleData[0].battleLog).to.equal(battleLog);
      expect(seasonBattleData[1].timestamp).not.to.equal(0);
      expect(seasonBattleData[1].winMonsterId).to.equal(0);
      expect(seasonBattleData[1].loseMonsterId).to.equal(1);
      expect(seasonBattleData[1].battleLog).to.equal(battleLog);
    });
  });
});
