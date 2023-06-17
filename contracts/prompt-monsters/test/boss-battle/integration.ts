import {
  PromptMonsters,
  Erc20,
  BossBattle,
  BossBattleMch1,
  BossMonsterMchYoshka,
  PromptMonstersExtension,
  PromptMonstersImage,
} from "../../typechain-types";
import {
  BBState,
  FireMonsterDetails,
  FireMonsterExtensionDetails,
  FireMonsterNoExtensionDetails,
  MonsterExtensionDetails,
  Rp1Turn1BBState,
  Rp1Turn2BBState,
  YoshkaExtensionDetails,
  defaultBBState,
  firstBossSignForRp1,
  firstMonsterAdjForRp1,
  initialBBState,
  initialMintPrice,
  monsterAdjForRp1,
  transformBBState,
  transformMonsterExtensionDetails,
} from "../helpers/test_constants";
import { deploy } from "./Deployment";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BossBattle Integration Test", function () {
  let promptMonsters: PromptMonsters;
  let promptMonstersImage: PromptMonstersImage;
  let promptMonstersExtension: PromptMonstersExtension;
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

  let boss: MonsterExtensionDetails;
  let rps: Array<MonsterExtensionDetails>;
  let rp1: MonsterExtensionDetails;
  let rp2: MonsterExtensionDetails;

  let bbState: BBState;

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
    promptMonstersImage = deploymentResult.promptMonstersImage;
    promptMonstersExtension = deploymentResult.promptMonstersExtension;
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
    describe("PromptMonsters", function () {
      it("promptMonsters address", async function () {
        expect(promptMonsters.address).to.not.equal(
          ethers.constants.AddressZero,
          "zero address",
        );
      });
    });

    describe("BossBattle", function () {
      it("bossBattle address", async function () {
        expect(bossBattle.address).to.not.equal(
          ethers.constants.AddressZero,
          "zero address",
        );
      });
    });

    describe("BossBattleMch1", function () {
      it("bossBattleMch1 address", async function () {
        expect(bossBattleMch1.address).to.not.equal(
          ethers.constants.AddressZero,
          "zero address",
        );
      });
    });

    describe("BossMonsterMchYoshka", function () {
      it("bossMonsterMchYoshka address", async function () {
        expect(bossMonsterMchYoshka.address).to.not.equal(
          ethers.constants.AddressZero,
          "zero address",
        );
      });
    });
  });

  describe("Before BossBattle", function () {
    describe("Mint promptMonsters", function () {
      it("generate promptMonsters", async function () {
        expect(
          await promptMonsters
            .connect(deployer)
            .generateMonster(resurrectionPrompt1.address, FireMonsterDetails),
        ).not.to.be.reverted;
      });

      it("mint promptMonsters by user1", async function () {
        await expect(
          erc20
            .connect(user1)
            .increaseAllowance(promptMonsters.address, initialMintPrice),
        ).not.to.be.reverted;
        expect(
          await promptMonsters.connect(user1).mint(resurrectionPrompt1.address),
        ).not.to.be.reverted;
      });
    });
  });

  describe("Setting BossBattle", function () {
    describe("Set BossMonster's status", function () {
      it("addLanguage", async function () {
        expect(await bossMonsterMchYoshka.addLanguage("Japanese")).not.to.be
          .reverted;

        expect(await bossMonsterMchYoshka.getLanguages()).to.deep.equal([
          "Japanese",
        ]);
      });

      it("setBoss & ", async function () {
        expect(
          await bossMonsterMchYoshka.setBoss(
            "Japanese",
            YoshkaExtensionDetails,
          ),
        ).not.to.be.reverted;

        expect(
          await bossMonsterMchYoshka.setSkillTypes(
            YoshkaExtensionDetails.skills,
            YoshkaExtensionDetails.skillTypes,
          ),
        ).not.to.be.reverted;

        boss = await bossBattle.getBossExtension("MCH", 0, "Japanese");
        boss = transformMonsterExtensionDetails(boss);

        expect(boss).to.deep.equal(YoshkaExtensionDetails);
      });
    });
  });

  describe("User flow", function () {
    describe("Before battle start", function () {
      describe("Get monster extensions", function () {
        it("getMonsterExtensions", async function () {
          rps = await promptMonsters.getMonsterExtensions([
            resurrectionPrompt1.address,
          ]);

          rp1 = transformMonsterExtensionDetails(rps[0]);
          expect(rp1).to.deep.equal(FireMonsterNoExtensionDetails);
        });
      });
      describe("Set monster adj", function () {
        it("setMonsterAdj", async function () {
          expect(
            await bossBattle
              .connect(deployer)
              .setMonsterAdj(
                "MCH",
                0,
                resurrectionPrompt1.address,
                monsterAdjForRp1,
              ),
          ).not.to.be.reverted;

          const adj = await bossBattle.getMonsterAdj(
            "MCH",
            0,
            resurrectionPrompt1.address,
          );
          expect(adj.weaknessFeatureAdj).to.equal(
            monsterAdjForRp1.weaknessFeatureAdj,
          );
        });
      });

      describe("Set monster extensions", function () {
        it("setMonsterAdj", async function () {
          expect(
            await promptMonstersExtension
              .connect(deployer)
              .setBatchSkillTypes(
                [resurrectionPrompt1.address],
                [FireMonsterExtensionDetails.skills],
                [FireMonsterExtensionDetails.skillTypes],
              ),
          ).not.to.be.reverted;

          rps = await promptMonsters.getMonsterExtensions([
            resurrectionPrompt1.address,
          ]);

          rp1 = transformMonsterExtensionDetails(rps[0]);
          expect(rp1).to.deep.equal(FireMonsterExtensionDetails);
        });
      });

      describe("Get BBState", function () {
        it("getBBState", async function () {
          bbState = await bossBattle.getBBState(
            "MCH",
            0,
            resurrectionPrompt1.address,
          );
          bbState = transformBBState(bbState);

          expect(bbState).to.deep.equal(defaultBBState);
        });
      });
    });

    describe("First battle start", function () {
      describe("Turn 1", function () {
        describe("Start BossBattle", function () {
          it("startBossBattle", async function () {
            expect(
              await bossBattle
                .connect(deployer)
                .startBossBattle(
                  "MCH",
                  0,
                  resurrectionPrompt1.address,
                  firstMonsterAdjForRp1,
                  firstBossSignForRp1,
                ),
            ).not.to.be.reverted;

            bbState = await bossBattle.getBBState(
              "MCH",
              0,
              resurrectionPrompt1.address,
            );
            bbState = transformBBState(bbState);

            expect(bbState).to.deep.equal(initialBBState);
          });

          it("Should revert startBossBattle if already started", async function () {
            await expect(
              bossBattle
                .connect(deployer)
                .startBossBattle(
                  "MCH",
                  0,
                  resurrectionPrompt1.address,
                  firstMonsterAdjForRp1,
                  firstBossSignForRp1,
                ),
            ).to.be.revertedWith(
              "BossBattleEvent: monster has already started boss battle",
            );
          });
        });

        describe("Update boss battle result", function () {
          it("updateBossBattleResult", async function () {
            expect(
              await bossBattle
                .connect(deployer)
                .updateBossBattleResult(
                  "MCH",
                  0,
                  resurrectionPrompt1.address,
                  Rp1Turn1BBState,
                ),
            ).not.to.be.reverted;

            bbState = await bossBattle.getBBState(
              "MCH",
              0,
              resurrectionPrompt1.address,
            );
            bbState = transformBBState(bbState);

            expect(bbState).to.deep.equal(Rp1Turn1BBState);
          });

          it("Should revert updateBossBattleResult if the turn does not continue", async function () {
            await expect(
              bossBattle
                .connect(deployer)
                .updateBossBattleResult(
                  "MCH",
                  0,
                  resurrectionPrompt1.address,
                  Rp1Turn1BBState,
                ),
            ).to.be.revertedWith(
              "BossBattleEvent: monster has not continued boss battle",
            );
          });
        });
      });

      describe("Turn 2", function () {
        describe("Continue boss battle", function () {
          it("continueBossBattle", async function () {
            expect(
              await bossBattle
                .connect(deployer)
                .continueBossBattle("MCH", 0, resurrectionPrompt1.address, 2),
            ).not.to.be.reverted;

            bbState = await bossBattle.getBBState(
              "MCH",
              0,
              resurrectionPrompt1.address,
            );
            bbState = transformBBState(bbState);

            expect(bbState).to.deep.equal({
              bossBattleStarted: Rp1Turn1BBState.bossBattleStarted,
              bossBattleContinued: true,
              lp: Rp1Turn1BBState.lp,
              turn: 2,
              score: Rp1Turn1BBState.score,
              monsterAdj: Rp1Turn1BBState.monsterAdj,
              bossAdj: Rp1Turn1BBState.bossAdj,
              bossSign: 2,
              hasHealItem: Rp1Turn1BBState.hasHealItem,
              hasBuffItem: Rp1Turn1BBState.hasBuffItem,
              hasDebuffItem: Rp1Turn1BBState.hasEscapeItem,
              hasEscapeItem: Rp1Turn1BBState.hasEscapeItem,
            });
          });

          it("Should revert continueBossBattle if the turn continues", async function () {
            await expect(
              bossBattle
                .connect(deployer)
                .continueBossBattle("MCH", 0, resurrectionPrompt1.address, 2),
            ).to.be.reverted;
          });
        });

        describe("Update boss battle result", function () {
          it("updateBossBattleResult", async function () {
            expect(
              await bossBattle
                .connect(deployer)
                .updateBossBattleResult(
                  "MCH",
                  0,
                  resurrectionPrompt1.address,
                  Rp1Turn2BBState,
                ),
            ).not.to.be.reverted;

            bbState = await bossBattle.getBBState(
              "MCH",
              0,
              resurrectionPrompt1.address,
            );
            bbState = transformBBState(bbState);

            expect(bbState).to.deep.equal(Rp1Turn2BBState);
          });

          it("Should revert continueBossBattle if the lp is 0", async function () {
            await expect(
              bossBattle
                .connect(deployer)
                .continueBossBattle("MCH", 0, resurrectionPrompt1.address, 3),
            ).to.be.revertedWith(
              "BossBattleEvent: You have already lost all LP",
            );
          });
        });

        describe("End boss battle", function () {
          it("endBossBattle", async function () {
            expect(
              await bossBattle
                .connect(deployer)
                .endBossBattle("MCH", 0, resurrectionPrompt1.address),
            ).not.to.be.reverted;
          });
        });
      });
    });
  });
});
