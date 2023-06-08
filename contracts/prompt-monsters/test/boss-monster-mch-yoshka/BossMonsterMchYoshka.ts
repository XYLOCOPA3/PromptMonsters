import {
  PromptMonsters,
  Erc20,
  BossBattle,
  BossBattleMch1,
  BossMonsterMchYoshka,
} from "../../typechain-types";
import { deploy } from "../boss-battle/Deployment";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

describe("BossMonsterMchYoshka Test", function () {
  let promptMonsters: PromptMonsters;
  let erc20: Erc20;
  let bossBattle: BossBattle;
  let bossBattleMch1: BossBattleMch1;
  let bossMonsterMchYoshka: BossMonsterMchYoshka;

  let deployer: SignerWithAddress;
  let promptMonstersWallet: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let resurrectionPrompt1: SignerWithAddress;
  let resurrectionPrompt2: SignerWithAddress;

  before(async () => {
    [
      deployer,
      promptMonstersWallet,
      user1,
      user2,
      resurrectionPrompt1,
      resurrectionPrompt2,
    ] = await ethers.getSigners();

    const deploymentResult = await deploy(deployer, promptMonstersWallet);

    promptMonsters = deploymentResult.promptMonsters;
    erc20 = deploymentResult.erc20;
    bossBattle = deploymentResult.bossBattle;
    bossBattleMch1 = deploymentResult.bossBattleMch1;
    bossMonsterMchYoshka = deploymentResult.bossMonsterMchYoshka;

    (
      await erc20.transfer(user1.address, ethers.utils.parseEther("10000"))
    ).wait();
    (
      await erc20.transfer(user2.address, ethers.utils.parseEther("10000"))
    ).wait();
  });

  describe("Deploy", function () {
    it("PromptMonsters: erc20 address", async function () {
      // expect(await promptMonsters.erc20()).to.equal(erc20.address);
    });
  });
});
