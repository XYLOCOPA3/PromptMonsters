import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BattleOffSeason", function () {
  async function init() {
    const { battleOffSeason, battle } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    (
      await battleOffSeason.grantRole(
        ethers.utils.id("GAME_ROLE"),
        battle.address,
      )
    ).wait();

    return {
      battle,
      battleOffSeason,
      deployer,
      user1,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { battle, battleOffSeason } = await loadFixture(init);
      expect(battle.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(battleOffSeason.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });
    it("BattleOffSeason: Battle Address", async function () {
      const { battle, battleOffSeason } = await loadFixture(init);
      expect(
        await battleOffSeason.getRoleMember(ethers.utils.id("GAME_ROLE"), 1),
      ).to.equal(battle.address);
    });
    it("BattleOffSeason: getMatchCount", async function () {
      const { battleOffSeason } = await loadFixture(init);
      expect(await battleOffSeason.getMatchCount(0)).to.equal(0);
    });
    it("BattleOffSeason: getWinCount", async function () {
      const { battleOffSeason } = await loadFixture(init);
      expect(await battleOffSeason.getWinCount(0)).to.equal(0);
    });
    it("BattleOffSeason: getBattleDataByMonsterId", async function () {
      const { battleOffSeason } = await loadFixture(init);
      expect(await battleOffSeason.getBattleDataByMonsterId(0));
    });
    it("BattleOffSeason: getBattleIdList", async function () {
      const { battleOffSeason } = await loadFixture(init);
      expect(await battleOffSeason.getBattleIdList(0)).to.deep.equal([]);
    });
  });
});
