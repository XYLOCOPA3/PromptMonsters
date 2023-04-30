import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Battle", function () {
  async function init() {
    const { battle, battleS1 } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    (
      await battleS1.grantRole(ethers.utils.id("GAME_ROLE"), battle.address)
    ).wait();

    return {
      battle,
      battleS1,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { battle, battleS1, deployer, user1 } = await loadFixture(init);
      expect(battle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(battleS1.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });
    it("BattleS1: Battle Address", async function () {
      const { battle, battleS1 } = await loadFixture(init);
      expect(
        await battleS1.getRoleMember(ethers.utils.id("GAME_ROLE"), 1),
      ).to.equal(battle.address);
    });
    it("BattleS1: getMatchCount", async function () {
      const { battle, battleS1 } = await loadFixture(init);
      expect(await battleS1.getMatchCount(0)).to.equal(0);
    });
    it("BattleS1: getWinCount", async function () {
      const { battle, battleS1 } = await loadFixture(init);
      expect(await battleS1.getWinCount(0)).to.equal(0);
    });
    it("BattleS1: getBattleDataByMonsterId", async function () {
      const { battle, battleS1 } = await loadFixture(init);
      expect(await battleS1.getBattleDataByMonsterId(0));
    });
    it("BattleS1: getBattleIdList", async function () {
      const { battleS1 } = await loadFixture(init);
      expect(await battleS1.getBattleIdList(0)).to.deep.equal([]);
    });
  });

  describe("Battle", function () {
    it("addSeasonBattleData", async function () {
      const { battle, battleS1 } = await loadFixture(init);
      expect(await battle.addBattleSeasonAddress(battleS1.address)).not.to.be
        .reverted;
      expect(await battle.getSeasonMatchCount(0, 0)).to.equal(0);
      expect(await battle.getSeasonMatchCount(0, 1)).to.equal(0);
      expect(await battle.getSeasonWinCount(0, 0)).to.equal(0);
      expect(await battle.getSeasonWinCount(0, 1)).to.equal(0);
      expect(await battle.getSeasonBattleIdList(0, 0)).to.deep.equal([]);
      expect(await battle.getSeasonBattleIdList(0, 1)).to.deep.equal([]);
      // addSeasonBattleData
      // expect(await battle.addSeasonBattleData(0, 0, 0, 1, battleLog)).not.to.be
      //   .reverted;
      // expect(await battle.getSeasonMatchCount(0, 0)).to.equal(1);
      // expect(await battle.getSeasonMatchCount(0, 1)).to.equal(1);
      // expect(await battle.getSeasonWinCount(0, 0)).to.equal(1);
      // expect(await battle.getSeasonWinCount(0, 1)).to.equal(0);
      // expect(await battle.getSeasonBattleIdList(0, 0)).to.deep.equal([0]);
      // expect(await battle.getSeasonBattleIdList(0, 1)).to.deep.equal([0]);
      // let seasonBattleDataByMonsterId =
      //   await battle.getSeasonBattleDataByMonsterId(0, 0);
      // expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
      // expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
      // expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
      // expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
      // seasonBattleDataByMonsterId = await battle.getSeasonBattleDataByMonsterId(
      //   0,
      //   1,
      // );
      // expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
      // expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
      // expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
      // expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
      // let seasonBattleData = await battle.getSeasonBattleData(0);
      // expect(seasonBattleData.length).to.equal(1);
      // expect(seasonBattleData[0].timestamp).not.to.equal(0);
      // expect(seasonBattleData[0].winMonsterId).to.equal(0);
      // expect(seasonBattleData[0].loseMonsterId).to.equal(1);
      // expect(seasonBattleData[0].battleLog).to.equal(battleLog);
    });
    // it("addSeasonBattleData twice", async function () {
    //   const { battle, battleS1 } = await loadFixture(init);
    //   expect(await battle.addBattleSeasonAddress(battleS1.address)).not.to.be
    //     .reverted;
    //   // addSeasonBattleData
    //   expect(await battle.addSeasonBattleData(0, 0, 0, 1, battleLog)).not.to.be
    //     .reverted;
    //   expect(await battle.addSeasonBattleData(0, 0, 0, 1, battleLog)).not.to.be
    //     .reverted;
    //   expect(await battle.getSeasonMatchCount(0, 0)).to.equal(2);
    //   expect(await battle.getSeasonMatchCount(0, 1)).to.equal(2);
    //   expect(await battle.getSeasonWinCount(0, 0)).to.equal(2);
    //   expect(await battle.getSeasonWinCount(0, 1)).to.equal(0);
    //   expect(await battle.getSeasonBattleIdList(0, 0)).to.deep.equal([0, 1]);
    //   expect(await battle.getSeasonBattleIdList(0, 1)).to.deep.equal([0, 1]);
    //   let seasonBattleDataByMonsterId =
    //     await battle.getSeasonBattleDataByMonsterId(0, 0);
    //   expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
    //   expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
    //   expect(seasonBattleDataByMonsterId[1].timestamp).not.to.equal(0);
    //   expect(seasonBattleDataByMonsterId[1].winMonsterId).to.equal(0);
    //   expect(seasonBattleDataByMonsterId[1].loseMonsterId).to.equal(1);
    //   expect(seasonBattleDataByMonsterId[1].battleLog).to.equal(battleLog);
    //   seasonBattleDataByMonsterId = await battle.getSeasonBattleDataByMonsterId(
    //     0,
    //     1,
    //   );
    //   expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
    //   expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
    //   expect(seasonBattleDataByMonsterId[1].timestamp).not.to.equal(0);
    //   expect(seasonBattleDataByMonsterId[1].winMonsterId).to.equal(0);
    //   expect(seasonBattleDataByMonsterId[1].loseMonsterId).to.equal(1);
    //   expect(seasonBattleDataByMonsterId[1].battleLog).to.equal(battleLog);
    //   let seasonBattleData = await battle.getSeasonBattleData(0);
    //   expect(seasonBattleData.length).to.equal(2);
    //   expect(seasonBattleData[0].timestamp).not.to.equal(0);
    //   expect(seasonBattleData[0].winMonsterId).to.equal(0);
    //   expect(seasonBattleData[0].loseMonsterId).to.equal(1);
    //   expect(seasonBattleData[0].battleLog).to.equal(battleLog);
    //   expect(seasonBattleData[1].timestamp).not.to.equal(0);
    //   expect(seasonBattleData[1].winMonsterId).to.equal(0);
    //   expect(seasonBattleData[1].loseMonsterId).to.equal(1);
    //   expect(seasonBattleData[1].battleLog).to.equal(battleLog);
    // });
  });
});
