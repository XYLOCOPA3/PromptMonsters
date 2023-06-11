import {
  FireMonsterDetails,
  WaterMonsterDetails,
  initialStamina,
} from "../helpers/test_constants";
import { deploy } from "./Deployment/Deployment";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TestS", function () {
  async function init() {
    const { stamina, promptMonsters, erc20 } = await loadFixture(deploy);

    const [deployer, user1, resurrectionPrompt1, resurrectionPrompt2] =
      await ethers.getSigners();

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
      resurrectionPrompt1,
      resurrectionPrompt2,
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
      const {
        stamina,
        promptMonsters,
        erc20,
        deployer,
        user1,
        resurrectionPrompt1,
        resurrectionPrompt2,
      } = await loadFixture(init);

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(resurrectionPrompt1.address, FireMonsterDetails),
      ).not.to.be.reverted;

      await expect(
        erc20
          .connect(user1)
          .increaseAllowance(
            promptMonsters.address,
            ethers.utils.parseEther("100"),
          ),
      ).not.to.be.reverted;

      await expect(
        promptMonsters.connect(user1).mint(resurrectionPrompt1.address),
      ).not.to.be.reverted;

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(resurrectionPrompt2.address, WaterMonsterDetails),
      ).not.to.be.reverted;

      await expect(
        erc20
          .connect(user1)
          .increaseAllowance(
            promptMonsters.address,
            ethers.utils.parseEther("100"),
          ),
      ).not.to.be.reverted;

      await expect(
        promptMonsters.connect(user1).mint(resurrectionPrompt2.address),
      ).not.to.be.reverted;

      expect(await stamina.getTimeStd(0)).to.equal(0);
      expect(await stamina.getTimeStd(1)).to.equal(0);

      expect(await stamina.calculateStamina(0)).to.equal(initialStamina);
      expect(await stamina.calculateStamina(1)).to.equal(initialStamina);

      expect(await stamina.connect(deployer).consumeStamina(0, 1)).not.to.be
        .reverted;

      expect(await stamina.connect(deployer).consumeStamina(1, 1)).not.to.be
        .reverted;

      expect(await stamina.calculateStamina(2)).to.equal(initialStamina);
      expect(await stamina.calculateStamina(2)).to.equal(initialStamina);
    });
  });
});
