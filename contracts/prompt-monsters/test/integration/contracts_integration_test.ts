import {
  PromptMonsters,
  Erc20,
  Stamina,
  Battle,
  BattleOffSeason,
  BattleS1,
} from "../../typechain-types";
import { deploy } from "./Deployment/Deployment";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

describe("Integration Test", function () {
  let promptMonsters: PromptMonsters;
  let erc20: Erc20;
  let stamina: Stamina;
  let battle: Battle;
  let battleOffSeason: BattleOffSeason;
  let battleS1: BattleS1;

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
    stamina = deploymentResult.stamina;
    battle = deploymentResult.battle;
    battleOffSeason = deploymentResult.battleOffSeason;
    battleS1 = deploymentResult.battleS1;

    (
      await erc20.transfer(user1.address, ethers.utils.parseEther("10000"))
    ).wait();
    (
      await erc20.transfer(user2.address, ethers.utils.parseEther("10000"))
    ).wait();
  });

  describe("Deploy", function () {
    // it("PromptMonsters: erc20 address", async function () {
    //   expect(await promptMonsters.erc20()).to.equal(erc20.address);
    // });
  });

  describe("PromptMonsters", function () {
    describe("Main logic", function () {
      // it("Deployer generate resurrectionPrompt1", async function () {
      // let generatedMonster1 = await promptMonsters.getMonsterHistory(
      //   resurrectionPrompt1.address,
      // );
      // expect(transformMonsterDetails(generatedMonster1)).to.deep.equal(
      //   emptyDetails,
      // );
      // await promptMonsters
      //   .connect(deployer)
      //   .generateMonster(resurrectionPrompt1.address, FireMonsterDetails);
      // generatedMonster1 = await promptMonsters.getMonsterHistory(
      //   resurrectionPrompt1.address,
      // );
      // expect(transformMonsterDetails(generatedMonster1)).to.deep.equal(
      //   FireMonsterDetails,
      // );
      // });
      // it("User1 mint resurrectionPrompt1", async function () {
      // const mintPrice = await promptMonsters.mintPrice();
      // await expect(
      //   erc20
      //     .connect(user1)
      //     .increaseAllowance(promptMonsters.address, mintPrice),
      // ).not.to.be.reverted;
      // await promptMonsters.connect(user1).mint(resurrectionPrompt1.address);
      // const generatedMonster1 = await promptMonsters.getMonsterHistory(
      //   resurrectionPrompt1.address,
      // );
      // expect(transformMonsterDetails(generatedMonster1)).to.deep.equal(
      //   FireMonsterDetails,
      // );
      // });
    });
  });

  describe("User flow", function () {
    // it("Deployer generate resurrectionPrompt1", async function () {
    //   await promptMonsters
    //     .connect(deployer)
    //     .generateMonster(resurrectionPrompt1.address, FireMonsterDetails);
    // });
    // it("User1 increaseAllowance erc20 to promptMonsters address", async function () {
    //   const mintPrice = await promptMonsters.mintPrice();
    //   await expect(
    //     erc20
    //       .connect(user1)
    //       .increaseAllowance(promptMonsters.address, mintPrice),
    //   ).not.to.be.reverted;
    // });
    // it("User1 mint resurrectionPrompt1", async function () {
    //   await promptMonsters.connect(user1).mint(resurrectionPrompt1.address);
    // });
    // it("Deployer generate resurrectionPrompt2", async function () {
    //   await promptMonsters
    //     .connect(deployer)
    //     .generateMonster(resurrectionPrompt2.address, WaterMonsterDetails);
    // });
    // it("User2 increaseAllowance erc20 to promptMonsters address", async function () {
    //   const mintPrice = await promptMonsters.mintPrice();
    //   await expect(
    //     erc20
    //       .connect(user2)
    //       .increaseAllowance(promptMonsters.address, mintPrice),
    //   ).not.to.be.reverted;
    // });
    // it("User2 mint resurrectionPrompt2", async function () {
    //   await promptMonsters.connect(user2).mint(resurrectionPrompt2.address);
    // });
    // it("1st Fight and deployer addSeasonBattleData", async function () {
    //   expect(await battle.getSeasonMatchCount(0, 0)).to.equal(0);
    //   expect(await battle.getSeasonMatchCount(0, 1)).to.equal(0);
    //   expect(await battle.getSeasonWinCount(0, 0)).to.equal(0);
    //   expect(await battle.getSeasonWinCount(0, 1)).to.equal(0);
    //   expect(await battle.getSeasonBattleIdList(0, 0)).to.deep.equal([]);
    //   expect(await battle.getSeasonBattleIdList(0, 1)).to.deep.equal([]);
    //   expect(
    //     await battle
    //       .connect(deployer)
    //       .addSeasonBattleData(0, 0, 0, 1, battleLog),
    //   ).not.to.be.reverted;
    //   expect(await battle.getSeasonMatchCount(0, 0)).to.equal(1);
    //   expect(await battle.getSeasonMatchCount(0, 1)).to.equal(1);
    //   expect(await battle.getSeasonWinCount(0, 0)).to.equal(1);
    //   expect(await battle.getSeasonWinCount(0, 1)).to.equal(0);
    //   expect(await battle.getSeasonBattleIdList(0, 0)).to.deep.equal([0]);
    //   expect(await battle.getSeasonBattleIdList(0, 1)).to.deep.equal([0]);
    //   let seasonBattleDataByMonsterId =
    //     await battle.getSeasonBattleDataByMonsterId(0, 0);
    //   expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
    //   expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
    //   seasonBattleDataByMonsterId = await battle.getSeasonBattleDataByMonsterId(
    //     0,
    //     1,
    //   );
    //   expect(seasonBattleDataByMonsterId[0].timestamp).not.to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].winMonsterId).to.equal(0);
    //   expect(seasonBattleDataByMonsterId[0].loseMonsterId).to.equal(1);
    //   expect(seasonBattleDataByMonsterId[0].battleLog).to.equal(battleLog);
    //   let seasonBattleData = await battle.getSeasonBattleData(0);
    //   expect(seasonBattleData.length).to.equal(1);
    //   expect(seasonBattleData[0].timestamp).not.to.equal(0);
    //   expect(seasonBattleData[0].winMonsterId).to.equal(0);
    //   expect(seasonBattleData[0].loseMonsterId).to.equal(1);
    //   expect(seasonBattleData[0].battleLog).to.equal(battleLog);
    // });
    // it("2nd Fight and deployer addSeasonBattleData", async function () {
    //   expect(await battle.addBattleSeasonAddress(battleS1.address)).not.to.be
    //     .reverted;
    //   // addSeasonBattleData
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
