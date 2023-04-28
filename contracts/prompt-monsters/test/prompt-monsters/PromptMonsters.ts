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

describe("PromptMonsters", function () {
  async function init() {
    const { promptMonsters, erc20 } = await loadFixture(deploy);

    const [deployer, user1, promptMonstersWallet] = await ethers.getSigners();

    return {
      promptMonsters,
      erc20,
      deployer,
      user1,
      promptMonstersWallet,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      expect(promptMonsters.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
      expect(erc20.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });

    it("erc20 Address", async function () {
      const { promptMonsters, erc20 } = await loadFixture(init);

      expect(await promptMonsters.erc20()).to.equal(erc20.address);
    });

    it("mintPrice", async function () {
      const { promptMonsters } = await loadFixture(init);

      expect(await promptMonsters.mintPrice()).to.equal(
        ethers.utils.parseEther("100"),
      );
    });
  });

  describe("Setter", function () {
    it("setExternalLink", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      await expect(
        promptMonsters.setExternalLink("https://externalLink-change/"),
      ).not.to.be.reverted;
    });

    it("setErc20", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      expect(await promptMonsters.erc20()).not.to.equal(user1.address);

      await expect(promptMonsters.setErc20(user1.address)).not.to.be.reverted;

      expect(await promptMonsters.erc20()).to.equal(user1.address);
    });

    it("setMintPrice", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      expect(await promptMonsters.mintPrice()).not.to.equal(
        ethers.utils.parseEther("200"),
      );

      await expect(promptMonsters.setMintPrice(ethers.utils.parseEther("200")))
        .not.to.be.reverted;

      expect(await promptMonsters.mintPrice()).to.equal(
        ethers.utils.parseEther("200"),
      );
    });
  });

  describe("Main Logic", function () {
    it("generateMonster 1st", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(user1.address, FireMonsterDetails),
      ).not.to.be.reverted;

      const monster = await promptMonsters
        .connect(user1.address)
        .getMonsterHistory();

      expect(monster.name).to.equal(FireMonsterDetails.name);
      expect(monster.flavor).to.equal(FireMonsterDetails.flavor);
      expect(monster.skills[0]).to.equal(FireMonsterDetails.skills[0]);
      expect(monster.skills[1]).to.equal(FireMonsterDetails.skills[1]);
      expect(monster.skills[2]).to.equal(FireMonsterDetails.skills[2]);
      expect(monster.lv).to.equal(FireMonsterDetails.lv);
      expect(monster.hp).to.equal(FireMonsterDetails.hp);
      expect(monster.atk).to.equal(FireMonsterDetails.atk);
      expect(monster.def).to.equal(FireMonsterDetails.def);
      expect(monster.inte).to.equal(FireMonsterDetails.inte);
      expect(monster.mgr).to.equal(FireMonsterDetails.mgr);
      expect(monster.agl).to.equal(FireMonsterDetails.agl);
      expect(monster.maxSkills).to.equal(FireMonsterDetails.maxSkills);
      expect(monster.maxSkillsSet).to.equal(FireMonsterDetails.maxSkillsSet);
    });

    it("generateMonster 2nd", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(user1.address, FireMonsterDetails),
      ).not.to.be.reverted;

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(user1.address, WaterMonsterDetails),
      ).not.to.be.reverted;

      const monster = await promptMonsters
        .connect(user1.address)
        .getMonsterHistory();

      expect(monster.name).to.equal(WaterMonsterDetails.name);
      expect(monster.flavor).to.equal(WaterMonsterDetails.flavor);
      expect(monster.skills[0]).to.equal(WaterMonsterDetails.skills[0]);
      expect(monster.skills[1]).to.equal(WaterMonsterDetails.skills[1]);
      expect(monster.skills[2]).to.equal(WaterMonsterDetails.skills[2]);
      expect(monster.lv).to.equal(WaterMonsterDetails.lv);
      expect(monster.hp).to.equal(WaterMonsterDetails.hp);
      expect(monster.atk).to.equal(WaterMonsterDetails.atk);
      expect(monster.def).to.equal(WaterMonsterDetails.def);
      expect(monster.inte).to.equal(WaterMonsterDetails.inte);
      expect(monster.mgr).to.equal(WaterMonsterDetails.mgr);
      expect(monster.agl).to.equal(WaterMonsterDetails.agl);
      expect(monster.maxSkills).to.equal(WaterMonsterDetails.maxSkills);
      expect(monster.maxSkillsSet).to.equal(WaterMonsterDetails.maxSkillsSet);
    });

    it("Should revert with non admin", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      await expect(
        promptMonsters
          .connect(user1)
          .generateMonster(user1.address, FireMonsterDetails),
      ).to.be.reverted;
    });
  });

  describe("Mint", function () {
    it("mint", async function () {
      const { promptMonsters, erc20, deployer, user1, promptMonstersWallet } =
        await loadFixture(init);

      expect(
        await erc20
          .connect(deployer)
          .transfer(user1.address, ethers.utils.parseEther("10000")),
      ).not.to.be.reverted;

      expect(
        (await erc20.balanceOf(user1.address)).gt(
          await promptMonsters.mintPrice(),
        ),
      ).to.be.true;

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

      expect(await promptMonsters.getMonstersTotalSupply()).to.equal(0);

      let monster = await promptMonsters
        .connect(user1.address)
        .getMonsterHistory();

      expect(monster.name).to.equal(FireMonsterDetails.name);
      expect(monster.flavor).to.equal(FireMonsterDetails.flavor);
      expect(monster.skills[0]).to.equal(FireMonsterDetails.skills[0]);
      expect(monster.skills[1]).to.equal(FireMonsterDetails.skills[1]);
      expect(monster.skills[2]).to.equal(FireMonsterDetails.skills[2]);
      expect(monster.lv).to.equal(FireMonsterDetails.lv);
      expect(monster.hp).to.equal(FireMonsterDetails.hp);
      expect(monster.atk).to.equal(FireMonsterDetails.atk);
      expect(monster.def).to.equal(FireMonsterDetails.def);
      expect(monster.inte).to.equal(FireMonsterDetails.inte);
      expect(monster.mgr).to.equal(FireMonsterDetails.mgr);
      expect(monster.agl).to.equal(FireMonsterDetails.agl);
      expect(monster.maxSkills).to.equal(FireMonsterDetails.maxSkills);
      expect(monster.maxSkillsSet).to.equal(FireMonsterDetails.maxSkillsSet);

      expect(
        await promptMonsters.getOwnerToTokenIds(user1.address),
      ).to.deep.equal([]);

      expect(await promptMonsters.balanceOf(user1.address)).to.equal(0);

      expect(await erc20.balanceOf(promptMonstersWallet.address)).to.equal(
        ethers.utils.parseEther("0"),
      );

      // Mint
      await expect(promptMonsters.connect(user1).mint()).not.to.be.reverted;

      expect(await promptMonsters.getMonstersTotalSupply()).to.equal(1);

      monster = await promptMonsters.connect(user1.address).getMonsterHistory();

      expect(monster.name).to.equal(FireMonsterDetails.name);
      expect(monster.flavor).to.equal(FireMonsterDetails.flavor);
      expect(monster.skills[0]).to.equal(FireMonsterDetails.skills[0]);
      expect(monster.skills[1]).to.equal(FireMonsterDetails.skills[1]);
      expect(monster.skills[2]).to.equal(FireMonsterDetails.skills[2]);
      expect(monster.lv).to.equal(FireMonsterDetails.lv);
      expect(monster.hp).to.equal(FireMonsterDetails.hp);
      expect(monster.atk).to.equal(FireMonsterDetails.atk);
      expect(monster.def).to.equal(FireMonsterDetails.def);
      expect(monster.inte).to.equal(FireMonsterDetails.inte);
      expect(monster.mgr).to.equal(FireMonsterDetails.mgr);
      expect(monster.agl).to.equal(FireMonsterDetails.agl);
      expect(monster.maxSkills).to.equal(FireMonsterDetails.maxSkills);
      expect(monster.maxSkillsSet).to.equal(FireMonsterDetails.maxSkillsSet);

      expect(
        await promptMonsters.getOwnerToTokenIds(user1.address),
      ).to.deep.equal([0]);

      expect(await promptMonsters.balanceOf(user1.address)).to.equal(1);

      expect(await erc20.balanceOf(promptMonstersWallet.address)).to.equal(
        await promptMonsters.mintPrice(),
      );

      const getMonsters = await promptMonsters.getMonsters([0]);
      const getMonster0 = getMonsters[0];

      expect(getMonster0.name).to.equal(FireMonsterDetails.name);
      expect(getMonster0.flavor).to.equal(FireMonsterDetails.flavor);
      expect(getMonster0.skills[0]).to.equal(FireMonsterDetails.skills[0]);
      expect(getMonster0.skills[1]).to.equal(FireMonsterDetails.skills[1]);
      expect(getMonster0.skills[2]).to.equal(FireMonsterDetails.skills[2]);
      expect(getMonster0.lv).to.equal(FireMonsterDetails.lv);
      expect(getMonster0.hp).to.equal(FireMonsterDetails.hp);
      expect(getMonster0.atk).to.equal(FireMonsterDetails.atk);
      expect(getMonster0.def).to.equal(FireMonsterDetails.def);
      expect(getMonster0.inte).to.equal(FireMonsterDetails.inte);
      expect(getMonster0.mgr).to.equal(FireMonsterDetails.mgr);
      expect(getMonster0.agl).to.equal(FireMonsterDetails.agl);
      expect(getMonster0.maxSkills).to.equal(FireMonsterDetails.maxSkills);
      expect(getMonster0.maxSkillsSet).to.equal(
        FireMonsterDetails.maxSkillsSet,
      );
    });

    it("should revert not enough tokens", async function () {
      const { promptMonsters, erc20, deployer, user1 } = await loadFixture(
        init,
      );

      expect(
        (await erc20.balanceOf(user1.address)).lt(
          await promptMonsters.mintPrice(),
        ),
      ).to.be.true;

      await expect(
        promptMonsters
          .connect(deployer)
          .generateMonster(user1.address, FireMonsterDetails),
      ).not.to.be.reverted;

      await expect(promptMonsters.connect(user1).mint()).to.be.reverted;
    });
  });
});
