import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const FireMonsterDetails = {
  name: "FireMonster",
  flavor: "Fire",
  skills: ["FireBall1", "FireBall2", "FireBall3"],
  lv: 10,
  hp: 100,
  atk: 10,
  def: 10,
  inte: 10,
  mgr: 10,
  agl: 10,
  maxSkills: 10,
  maxSkillsSet: 10,
};

const WaterMonsterDetails = {
  name: "WaterMonster",
  flavor: "Water",
  skills: ["WaterBlade1", "WaterBlade2", "WaterBlade3"],
  lv: 20,
  hp: 50,
  atk: 5,
  def: 20,
  inte: 10,
  mgr: 20,
  agl: 10,
  maxSkills: 10,
  maxSkillsSet: 10,
};

describe("Stamina", function () {
  async function init() {
    const { stamina, promptMonsters, erc20 } = await loadFixture(deploy);

    const [deployer, user1] = await ethers.getSigners();

    expect(
      await stamina.grantRole(ethers.utils.id("GAME_ROLE"), deployer.address),
    ).not.to.be.reverted;

    expect(
      await erc20
        .connect(deployer)
        .transfer(user1.address, ethers.utils.parseEther("10000")),
    ).not.to.be.reverted;

    return {
      stamina,
      promptMonsters,
      erc20,
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

  describe("Check stamina", function () {
    it("calculateStamina", async function () {
      const { stamina, promptMonsters, erc20, deployer, user1 } =
        await loadFixture(init);

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(user1.address, FireMonsterDetails),
      ).not.to.be.reverted;

      await expect(
        erc20
          .connect(user1)
          .increaseAllowance(
            promptMonsters.address,
            ethers.utils.parseEther("100"),
          ),
      ).not.to.be.reverted;

      await expect(promptMonsters.connect(user1).mint()).not.to.be.reverted;

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(user1.address, WaterMonsterDetails),
      ).not.to.be.reverted;

      await expect(
        erc20
          .connect(user1)
          .increaseAllowance(
            promptMonsters.address,
            ethers.utils.parseEther("100"),
          ),
      ).not.to.be.reverted;

      await expect(promptMonsters.connect(user1).mint()).not.to.be.reverted;

      expect(await stamina.getTimeStd(0)).to.equal(0);
      expect(await stamina.getTimeStd(1)).to.equal(0);

      expect(await stamina.calculateStamina(0)).to.equal(1);
      expect(await stamina.calculateStamina(1)).to.equal(1);

      expect(await stamina.connect(deployer).consumeStamina(0, 1)).not.to.be
        .reverted;

      expect(await stamina.connect(deployer).consumeStamina(1, 1)).not.to.be
        .reverted;

      expect(await stamina.calculateStamina(0)).to.equal(0);
      expect(await stamina.calculateStamina(1)).to.equal(0);
    });
  });
});
